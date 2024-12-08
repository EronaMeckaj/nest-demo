import { Injectable } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {

    constructor(private jwtService: JwtService, private userService: UsersService) { }

    async validateUser({ username, password }: AuthPayloadDto) {
        const user = await this.userService.findUserByUsername(username);
        if (!user || user.password !== password) {
            return null;
        }
        const { password: _, ...userWithoutPassword } = user;
        return this.jwtService.sign(userWithoutPassword);
    }
}


