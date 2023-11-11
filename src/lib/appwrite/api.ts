import { INewPost, INewUser, IUpdatePost } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (e) {
    console.log(e);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = account.get();

    if (!createUserAccount) throw Error;
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", (await currentAccount).$id)]
    );

    if (!currentAccount) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

// Post Logic funcs

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);

    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imagesUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPost() {
  const posts = databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postsCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );
  if (!posts) throw Error;

  return posts;
}

// Post stats

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatePost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatePost) throw Error;

    return updatePost;
  } catch (error) {
    console.log(error);
  }
}
export async function savePost(postId: string, userId: string) {
  try {
    const updatePost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatePost) throw Error;

    return updatePost;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteSavedPost(postId: string) {
  try {
    const savedPost = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      postId
    );

    if (!savedPost) throw Error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// Edit the post
export async function getPostById(postId?: string) {
  if (!postId) throw Error;
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );
    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileTpUpdate = post.file.length > 0;
  try {
    let image = {
      imagesUrl: post.imagesUrl,
      imageId: post.imageId,
    };

    if (hasFileTpUpdate) {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw Error;

      const fileUrl = getFilePreview(uploadedFile.$id);

      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = {
        ...image,
        imagesUrl: fileUrl,
        imageId: uploadedFile.toString(),
      };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      post.postId,
      {
        caption: post.caption,
        imagesUrl: image.imagesUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;
  try {
    const savedPost = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    if (!savedPost) throw Error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// explore Page

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPost(searchTerm: string) {
  try {
    const searchPost = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!searchPost) throw Error;

    return searchPost;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserPost(userId?: string) {
  if (!userId) throw Error;
  try {
    const getUsersPostsList = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!getUsersPostsList) throw Error;

    return getUsersPostsList;
  } catch (error) {
    console.log(error);
  }
}
