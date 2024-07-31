"use server";

import User from "../models/user.model"
import { connectToDB } from "@/lib/mongoose"

export async function fetchUserByEmail(email: string){
    try {
        connectToDB()
        const currentUser = User.findOne({ email: email} )
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

export async function fetchUsers() {
    try {
        connectToDB();

        const users = await User.find();

        return users;
    } catch (error: any) {
        throw new Error(`Error fetching users: ${error.message}`)
    }
}