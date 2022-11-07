import React from 'react'

export function ForumPost(props) {
  const { item } = props;

  return (
    <>
      <div>
        <p>{item.text}</p>
      </div>
    </>
  )
}