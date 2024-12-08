import { Controller, Get, Param, Post, Body, Query, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/upate-user.dto';
import { CreateUserProfileDto } from './dtos/create-user-profile.dto';
import { CreateUserPostDto } from './dtos/create-user-post.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    getUsers() {
        return this.usersService.getUsers()
    }

    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getUserById(id);
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        this.usersService.createUser(createUserDto)
    }

    @Patch(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        await this.usersService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUserById(@Param('id', ParseIntPipe) id: number) {
        await this.usersService.deleteUserById(id);
    }

    @Post(':id/profiles')
    createUserProfile(@Param('id', ParseIntPipe) id: number, @Body() createUserProfileDto: CreateUserProfileDto) {
        return this.usersService.createUserProfile(id, createUserProfileDto)
    }

    @Post(':id/posts')
    createUserPost(@Param('id', ParseIntPipe) id: number, @Body() createUserPostDto: CreateUserPostDto) {
        return this.usersService.createUserPost(id, createUserPostDto)
    }
}
