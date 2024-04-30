import React, { useEffect, useState } from "react";
import { useMutation, gql } from "@apollo/client";

const CREATE_COMMENT = gql`
  mutation createNewComment($input: CommentInput!) {
    createComment(input: $input) {
      name
    }
  }
`;

const DELETE_POST = gql`
  mutation deletePost($postId: Int!) {
    deletePost(input: { postId: $postId })
  }
`;

export default function PostCard({ post, refetch }) {
  const [imageUrl, setImageUrl] = useState("");
  const [comment, setComment] = useState(null);

  const generateNewImage = async () => {
    const res = await fetch("https://picsum.photos/800/400");
    setImageUrl(res.url);
  };

  useEffect(() => {
    generateNewImage();
  }, []);

  const [mutate, { data, loading, error }] = useMutation(CREATE_COMMENT);
  const [mutateDel] = useMutation(DELETE_POST);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>error occured: {error.message}</p>;

  function handleCommentChange(event) {
    setComment(event.target.value);
  }

  async function handleDelete() {
    await mutateDel({
      variables: {
        postId: post.id,
      },
    });
    await refetch();
  }

  async function submitComment() {
    if (!comment) return;

    await mutate({
      variables: {
        input: {
          postId: post.id,
          name: comment,
        },
      },
    });

    await refetch();

    setComment(null);
  }

  return (
    <>
      <div className="mt-4 mx-auto max-w-md rounded-lg overflow-hidden shadow-md">
        <img className="w-full h-64 object-cover" src={imageUrl} alt="Post" />
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2">{post.title}</h2>
          <p className="text-gray-700">{post.body}</p>
        </div>
        <div className="flex justify-between items-center px-6 py-4 bg-gray-100">
          <button
            onClick={handleDelete}
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-red-300"
          >
            Delete Post
          </button>
          <div className="flex">
            <input
              className="mr-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              type="text"
              placeholder="Write your comment ..."
              onChange={handleCommentChange}
            />
            <button
              onClick={submitComment}
              className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              Add Comment
            </button>
          </div>
        </div>
        <ul className="px-6 py-4">
          {post.comments.map((comment) => (
            <li key={comment.id} className="text-gray-700 mb-2">
              {comment.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
