import {StreamChat} from 'stream-chat'
import {ENV} from './env.js'
import {StreamClient} from '@stream-io/node-sdk'

const apiKey = ENV.STREAM_API_KEY
const apiSecret = ENV.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.log("STREAM_API_KEY or STREAM_API_SECRET")
}

export const streamClient = new StreamClient(apiKey, apiSecret, {
  timeout: 10000, // 🔥 increase to 10 seconds
});
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

export const upperStreamUser = async(userData) => {
    try {
        await chatClient.upsertUser(userData)
        console.log("stream user add successfully", userData)
    } catch (error) {
        console.error("error happened in upperStreamUser  in stream.js", error)
    }
}

export const deleteStreamUser = async(userId) => {
    try {
        await chatClient.deleteUser(userId)
       console.log("stream user add successfully", userId)
    } catch (error) {
        console.error("error happened in deleteStreamUser  in stream.js", error)
    }
}