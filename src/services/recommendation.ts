import { Request, Response } from 'express';
import driver from '../db';

export const createUser = async (req: Request, res: Response) => {
  const { userId, name } = req.body;
  const session = driver.session();

  try {
    await session.run(
      `MERGE (u:User {id: $userId}) SET u.name = $name`,
      { userId, name }
    );
    res.status(200).send('User created');
  } finally {
    await session.close();
  }
};

export const recommendBook = async (req: Request, res: Response) => {
  const { fromUserId, toUserId, bookTitle } = req.body;
  const session = driver.session();

  try {
    await session.run(`
      MERGE (from:User {id: $fromUserId})
      MERGE (to:User {id: $toUserId})
      MERGE (b:Book {title: $bookTitle})
      MERGE (from)-[:RECOMMENDED]->(b)
      MERGE (b)-[:RECOMMENDED_TO]->(to)
    `, { fromUserId, toUserId, bookTitle });
    res.status(200).send('Book recommended');
  } finally {
    await session.close();
  }
};

export const makeFriends = async (req: Request, res: Response) => {
  const { user1, user2 } = req.body;
  const session = driver.session();

  try {
    await session.run(`
      MATCH (u1:User {id: $user1}), (u2:User {id: $user2})
      MERGE (u1)-[:FRIENDS_WITH]->(u2)
      MERGE (u2)-[:FRIENDS_WITH]->(u1)
    `, { user1, user2 });
    res.status(200).send('Friendship created');
  } finally {
    await session.close();
  }
};

export const getRecommendations = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (me:User {id: $userId})-[:FRIENDS_WITH*1..2]-(friend)-[:RECOMMENDED]->(book)
      WHERE NOT (me)-[:RECOMMENDED]->(book)
      RETURN DISTINCT book.title AS title
      LIMIT 10
    `, { userId });

    const books = result.records.map(r => r.get('title'));
    res.json({ recommendations: books });
  } finally {
    await session.close();
  }
};
