import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { CreateUserParams, CreateUserPostParams, CreateUserProfileParams, UpdateUserParams } from 'src/utils/types';
import { Profile } from 'src/typeorm/entities/Profile';
import { Post } from 'src/typeorm/entities/Post';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        @InjectRepository(Post) private postRepository: Repository<Post>,
    ) { }

    getUsers() {
        return this.userRepository.find({ relations: ['profile', 'posts'] })
    }

    getUserById(id: number) {
        return this.userRepository.findOneBy({ id })
    }

    createUser(userDetails: CreateUserParams) {
        const newUser = this.userRepository.create({ ...userDetails, createdAt: new Date() })
        return this.userRepository.save(newUser)
    }

    updateUser(id: number, updateUserDetails: UpdateUserParams) {
        return this.userRepository.update({ id }, { ...updateUserDetails })
    }

    async deleteUserById(id: number) {
        try {
            await this.postRepository.delete({ user: { id } });
            const result = await this.userRepository.delete({ id });
            if (!result.affected) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return { message: 'User deleted successfully' };
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }


    async findUserByUsername(username: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { username } });
        return user;
    }

    async createUserProfile(id: number, createUserProfileDetails: CreateUserProfileParams) {
        const user = await this.userRepository.findOneBy({ id })
        if (!user) throw new HttpException('User not found. Cannot create profile.', HttpStatus.BAD_REQUEST)
        const newProfile = this.profileRepository.create(createUserProfileDetails)
        const savedProfile = await this.profileRepository.save(newProfile)
        user.profile = savedProfile;
        return this.userRepository.save(user)
    }

    async createUserPost(id: number, createUserPostDetails: CreateUserPostParams) {
        const user = await this.userRepository.findOneBy({ id })
        if (!user) throw new HttpException('User not found. Cannot create post.', HttpStatus.BAD_REQUEST)
        const newPost = this.postRepository.create({ ...createUserPostDetails, user })
        return this.postRepository.save(newPost)
    }
}
