function newStory(storyJSON) {
  storyDiv = document.createElement('div');
  storyDiv.setAttribute('id', storyJSON._id);
  storyDiv.className = 'story';

  ownerSpan = document.createElement('span');
  ownerSpan.className = 'story-owner';
  ownerSpan.innerHTML = "Owner: " + storyJSON.owner + "\n";
  storyDiv.appendChild(ownerSpan);

  messageSpan = document.createElement('span');
  messageSpan.className = 'story-message';
  messageSpan.innerHTML = "Message: " + storyJSON.message + "\n";
  storyDiv.appendChild(messageSpan);

  commentsDiv = document.createElement('div');
  commentsDiv.className = 'story-comments';
  for (var i=0; i < storyJSON.comments.length; ++i) {
    commentDiv = document.createElement('div');
    commentDiv.setAttributes('id', storyJSON.comments[i]._id);
    commentDiv.className = 'comment';

    commentOwnerSpan = document.createElement('span');
    commentOwnerSpan.className = 'comment-owner';
    commentOwnerSpan.innerHTML = "Comment Owner: " + storyJSON.comments[i].owner + "\n";
    commentDiv.appendChild(commentOwnerSpan);

    commentMessageSpan = document.createElement('span');
    commentMessageSpan.className = 'comment-message';
    commentMessageSpan.innerHTML = "Comment Message: " + storyJSON.comments[i].message + "\n";
    commentDiv.appendChild(commentMessageSpan);

    commentsDiv.appendChild(commentDiv);
  }
  storyDiv.appendChild(commentsDiv);

  return storyDiv;
};

function get(endpoint, queryVar, queryVal) {
  return new Promise(function(resolve, reject) {
    xhr = new XMLHttpRequest();
    fullPath = endpoint + '?' + queryVar + '=' + queryVal;
    xhr.open('GET', fullPath, true);
    xhr.onload = function(err) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.statusText);
        }
      }
    };
    xhr.onerror = function(err) {
      reject(xhr.statusText);
    }
    xhr.send(null);
  });
}

function renderStories() {
  storiesDiv = document.getElementById('stories');

  return get('/stories', '', '').then(function(stories) {
    if (stories.length === 0)
      return Promise.resolve(null);
    return Promise.all(stories.map(function(story) {
      storyJSON = story;
      // sketchy buggy shit happening here
      storyJSON.comments = get('/comment', 'parent', story._id);
      storiesDiv.appendChild(newStory(storyJSON));
    }));
  });
}

renderStories();
