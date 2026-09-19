import { GraphQLClient, gql, ClientError } from "graphql-request";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const REPO_OWNER = process.env.GITHUB_REPO_OWNER!;
const REPO_NAME = process.env.GITHUB_REPO_NAME!;
const POSTS_CATEGORY_NAME = process.env.GITHUB_POSTS_CATEGORY_NAME ?? "Posts";

function isConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN && REPO_OWNER && REPO_NAME);
}

function client() {
  return new GraphQLClient(GITHUB_GRAPHQL_ENDPOINT, {
    headers: { authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
  });
}

export type Author = {
  login: string;
  avatarUrl: string;
} | null;

export type DiscussionSummary = {
  number: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  url: string;
};

export type DiscussionComment = {
  id: string;
  body: string;
  createdAt: string;
  author: Author;
  reactions: { totalCount: number };
  replies: {
    nodes: Array<{
      id: string;
      body: string;
      createdAt: string;
      author: Author;
    }>;
  };
};

export type Discussion = DiscussionSummary & {
  body: string;
  author: Author;
  category: { name: string };
  reactions: { totalCount: number };
  comments: {
    totalCount: number;
    nodes: DiscussionComment[];
  };
};

const CATEGORIES_QUERY = gql`
  query GetCategories($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      discussionCategories(first: 25) {
        nodes {
          id
          name
        }
      }
    }
  }
`;

const LIST_DISCUSSIONS_QUERY = gql`
  query ListDiscussions($owner: String!, $repo: String!, $categoryId: ID!) {
    repository(owner: $owner, name: $repo) {
      discussions(
        categoryId: $categoryId
        first: 100
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        nodes {
          number
          title
          createdAt
          updatedAt
          url
        }
      }
    }
  }
`;

const GET_DISCUSSION_QUERY = gql`
  query GetDiscussion($owner: String!, $repo: String!, $number: Int!) {
    repository(owner: $owner, name: $repo) {
      discussion(number: $number) {
        number
        title
        createdAt
        updatedAt
        url
        body
        author {
          login
          avatarUrl(size: 64)
        }
        category {
          name
        }
        reactions {
          totalCount
        }
        comments(first: 50) {
          totalCount
          nodes {
            id
            body
            createdAt
            author {
              login
              avatarUrl(size: 40)
            }
            reactions {
              totalCount
            }
            replies(first: 20) {
              nodes {
                id
                body
                createdAt
                author {
                  login
                  avatarUrl(size: 32)
                }
              }
            }
          }
        }
      }
    }
  }
`;

let cachedCategoryId: string | null = null;

async function getPostsCategoryId(): Promise<string> {
  if (cachedCategoryId) return cachedCategoryId;

  const data = await client().request<{
    repository: { discussionCategories: { nodes: { id: string; name: string }[] } };
  }>(CATEGORIES_QUERY, { owner: REPO_OWNER, repo: REPO_NAME });

  const category = data.repository.discussionCategories.nodes.find(
    (node) => node.name === POSTS_CATEGORY_NAME
  );

  if (!category) {
    throw new Error(
      `No discussion category named "${POSTS_CATEGORY_NAME}" found in ${REPO_OWNER}/${REPO_NAME}`
    );
  }

  cachedCategoryId = category.id;
  return category.id;
}

export async function getPublishedDiscussions(): Promise<DiscussionSummary[]> {
  if (!isConfigured()) {
    console.warn(
      "GitHub Discussions env vars not set (GITHUB_TOKEN / GITHUB_REPO_OWNER / GITHUB_REPO_NAME) — returning no posts. See .env.local.example."
    );
    return [];
  }

  const categoryId = await getPostsCategoryId();

  const data = await client().request<{
    repository: { discussions: { nodes: DiscussionSummary[] } };
  }>(LIST_DISCUSSIONS_QUERY, {
    owner: REPO_OWNER,
    repo: REPO_NAME,
    categoryId,
  });

  return data.repository.discussions.nodes;
}

export async function getDiscussionByNumber(
  number: number
): Promise<Discussion | null> {
  if (!isConfigured()) return null;

  let data: { repository: { discussion: Discussion | null } };
  try {
    data = await client().request(GET_DISCUSSION_QUERY, {
      owner: REPO_OWNER,
      repo: REPO_NAME,
      number,
    });
  } catch (error) {
    // GitHub's GraphQL API returns a top-level NOT_FOUND error (rather than
    // just a null field) when the discussion number doesn't exist at all.
    if (
      error instanceof ClientError &&
      error.response.errors?.some((e) => (e as { type?: string }).type === "NOT_FOUND")
    ) {
      return null;
    }
    throw error;
  }

  const discussion = data.repository.discussion;
  if (!discussion || discussion.category.name !== POSTS_CATEGORY_NAME) {
    return null;
  }

  return discussion;
}
