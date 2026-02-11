import conf from '../conf/conf.js';
import {Client, Databases, Storage, Query, ID} from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;

    constructor(){
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }

    async getPost(slug){
        try{
            return await this.databases.getDocument(
                conf.appwriteDatabaseId, 
                conf.appwriteCollectionId, 
                slug
            )
        } catch(error) {
            console.log("Apwrite service :: getPost() ::", error)
        }
    }

    async getPosts(queries = [Query.equal("status","active")]){
         try{
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId, 
                conf.appwriteCollectionId, 
                queries
            )
         } catch(error){
            console.log("Apwrite service :: getPosts() ::", error)
         }
    }


    async createPost({title,slug, content, featuredImage, status, userId}){
        try{
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            )
        } catch(error){
            console.log("Apwrite service :: createPost() ::", error)
        }
    }

    async updatePost(slug, {title,content,featuredImage,status}){
        try{
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status
                }
            )
        } catch(error){
            console.log("Apwrite service :: updatePost() ::", error)
        }
    }

    async deletePost(slug){
        try{
                await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true;
        } catch(error){
            console.log("Apwrite service :: deletePost() ::", error);
            return false;
        }
    }

    // storage service

    async uploadFile(file){
        try{
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch(error){
            console.log("Apwrite service :: uploadFile() ::", error);
            return false;
        }
    }
 
    
    async deleteFile(fileId){
        try{
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        } catch(error){
            console.log("Apwrite service :: deleteFile() ::", error);
            return false;
        }
    }

    getFilePreview(fileId){
        try {
            // Use getFileView instead of getFilePreview to avoid image transformation restrictions
            const url = this.bucket.getFileView(
                conf.appwriteBucketId,
                fileId
            );
            return url;
        } catch(error){
            console.log("Appwrite service :: getFilePreview() :: error", error);
            return null;
        }
    }  

}

const service = new Service();

export default service;
