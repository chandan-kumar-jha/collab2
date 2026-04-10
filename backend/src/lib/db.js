import mongoose from "mongoose"
import { setServers } from "node:dns/promises"
import dns from "node:dns"

// ── DNS fix for Windows / IPv6 issues ─────────────────────────────
setServers(["8.8.8.8", "8.8.4.4"])
dns.setDefaultResultOrder("ipv4first")


import{ENV} from "./env.js"

export const connectDb = async() => {
    try {
        const conn = await mongoose.connect(ENV.DB_URL)
        console.log("✅ conntect with data base", conn.connection.host)
    } catch (error) {
        console.error("❌ error in connection db", error)
    }
}