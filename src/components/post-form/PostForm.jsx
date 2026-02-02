import React , {useCallback, useEffect} from 'react'
import {useForm} from 'react-hook-form'
import Button from '../Button.jsx'
import Input from '../Input.jsx'
import RTE  from '../RTE.jsx'
import Select from '../Select.jsx'
import appwriteService from '../../appwrite/config.js'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function PostForm({post}){
    const {register, handleSubmit, watch, setValue, control, getValues, formState: {errors}} = useForm({
        defaultValues: {
            title: post?.title||"",
            slug: post?.slug||"",
            content: post?.content||"",
            status: post?.status||"active"
        }
    })

    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)

    const submit = async(data) => {
        try {
            if (!userData) {
                alert("You must be logged in to create a post!");
                return;
            }
            
            if (post) {
                const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file) {
                    appwriteService.deleteFile(post.featuredImage);
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: file ? file.$id : undefined,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                
                if (!data.image || !data.image[0]) {
                    alert("Please select an image!");
                    return;
                }
                
                const file = await appwriteService.uploadFile(data.image[0]);

                if (file) {
                    const fileId = file.$id;
                    data.featuredImage = fileId;
                    
                    const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });

                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    }
                }
            }
        } catch (error) {
            console.error("Error in submit function:", error);
            alert(`Error: ${error.message}`);
        }
    }

    const slugTransform = useCallback((value) => {
        if(value && typeof value === 'string')
        return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g,'-')
        .replace(/\s/g,'-')
        return ''
    },[])

    useEffect(() => {
       const subscription = watch((value, {name}) => {
        if(name === 'title') {
            setValue('slug', slugTransform(value.title), {shouldValidate: true})
        }
       })
       return () => subscription.unsubscribe()
    }, [watch, setValue, slugTransform])

    // Initialize slug from title on mount
    useEffect(() => {
        const title = getValues('title');
        if (title && !getValues('slug')) {
            setValue('slug', slugTransform(title));
        }
    }, []);

    return (
        <form onSubmit={handleSubmit(submit)}
        className='flex flex-wrap'
        >
            <div className='w-2/3 px-2'>
            <Input
            label = 'title'
            placeholder = 'title'
            className = 'mb-4'
            {...register('title',{required: true})}
            />
            <Input
            label = 'slug'
            placeholder = 'slug'
            className = 'mb-4'
            {...register('slug',{required: true})}
            onInput =  {(e) => {
                setValue('slug', slugTransform(e.currentTarget.value), {shouldValidate: true})
            }}
            /> 
            <RTE
            label = 'content'
            name = 'content'
            control = {control}
            defaultValue = {getValues('content')}
            />
            {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}

            </div>

            <div className='w-1/3 px-2'>
            <Input 
            label = 'featured image'
            type = 'file'
            className = 'mb-4'
            accept = 'image/png, image/jpeg, image/jpg'
            {...register('image', {required: !post})}
            />
            {errors.image && (
                <p className="text-red-500 text-sm mt-1">Image is required</p>
            )}
            {post && (
                <div className='w-full mb-4'>
                    <img src={appwriteService.getFilePreview(post.featuredImage)} alt={post.title} 
                    className='rounded-lg'/>
                </div>
            )}
            <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button 
                    type="submit" 
                    bgColor={post ? "bg-green-500" : undefined} 
                    className="w-full"
                >
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    )

}