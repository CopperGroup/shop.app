"use server";

import User from "../models/user.model"
import { connectToDB } from "@/lib/mongoose"

export async function fetchUserByEmail(email: string){
    try {
        connectToDB()
        const currentUser = User.findOne({ email: email}).select("_id username email orders favourite cart discounts role isVerified name phoneNumber surname likes totalOrders")

        return currentUser
    } catch (error:any) {
        throw new Error(`Error getting current user ${error.message}`)
    }
}

export async function checkForAdmin(email: string){
    try {
        connectToDB();

        const currentUser = await User.findOne({ email: email });

        if(currentUser.isAdmin){
            return true
        } else return false
    } catch (error: any) {
        throw new Error(`Error determining, whether the user is admin ${error.message}`)
    }
}

export async function fetchUserById(userId: string) {
    try {
        connectToDB()

        const currentUser = User.findById(userId);

        return currentUser;
    } catch (error: any) {
        throw new Error(`Error fetching user by id, ${error.message}`)
    }
}

export async function fetchUsers(type?: "json") {
    try {
        connectToDB();

        const users = await User.find().select("_id email username orders");

        const fetchedUsers = [];

        for(const user of users) {
            fetchedUsers.push({ _id: user._id, email: user.email, username: user.username, orders: user.orders.length })
        }
        
        return fetchedUsers;
    } catch (error: any) {
        throw new Error(`Error fetching users: ${error.message}`)
    }
}