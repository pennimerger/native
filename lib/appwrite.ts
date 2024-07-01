import { FileType, FormProps } from "react-native"
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
} from "react-native-appwrite"

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.cavelight.native",
  projectId: "6679bde3002bf83d93c4",
  storageId: "6679d027002854afa9fa",
  databaseId: "6679c70600134482caf2",
  userCollectionId: "6679c79e00371f13cea4",
  videoCollectionId: "6679c8020007a15a99ad",
}

// init your react-native SDK
const client = new Client()

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform) // Your application or bundle ID

const account = new Account(client)
const storage = new Storage(client)
const avatars = new Avatars(client)
const databases = new Databases(client)

// Register user
export async function createUser(email: string, password: string, username: string) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    )

    if (!newAccount) throw Error

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    )

    return newUser
  } catch (error: any) {
    throw new Error(error)
  }
}

// Sign In
export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password)
    return session
  } catch (error: any) {
    // Handle the case where no session exists
    if (error.type !== 'AppwriteException' || error.message !== 'No session found') {
      throw error
    }
    throw new Error(error)
  }
}

// Get Account
export async function getAccount() {
  try {
    const currentAccount = await account.get()

    return currentAccount
  } catch (error: any) {
    throw new Error(error)
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount()
    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )

    if (!currentUser) throw Error

    return currentUser.documents[0]

  } catch (error) {
    console.log(error)
    return null
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current")

    return session
  } catch (error: any) {
    throw new Error(error)
  }
}

// Upload File
export async function uploadFile(file: FileType, type: string) {
  if (!file) return

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri
  }

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    )
    console.log("FILE", file)
    console.log("UPLOADED", uploadedFile)

    const fileUrl = await getFilePreview(uploadedFile.$id, type)
    return fileUrl
  } catch (error: any) {
    throw new Error(error)
  }
}

// Get File Preview
export async function getFilePreview(fileId: string, type: string) {
  let fileUrl

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId)
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      )
    } else {
      throw new Error("Invalid file type")
    }

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error: any) {
    throw new Error(error)
  }
}

// Create Video Post
export async function createVideoPost(form: FormProps) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ])

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    )

    return newPost
  } catch (error: any) {
    throw new Error(error)
  }
}

// Get all video Posts
export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc('$createdAt')]
    )

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    )

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}

// Get video posts created by user
export async function getUserPosts(userId: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc('$createdAt')]
    )

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}

// Get video posts that matches search query
export async function searchPosts(query: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    )

    if (!posts) throw new Error("Something went wrong")

    return posts.documents
  } catch (error: any) {
    throw new Error(error)
  }
}