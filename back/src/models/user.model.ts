import {
	IsEmail,
	IsNegative,
	IsNumber,
	IsOptional,
	IsString,
	MaxLength,
	Min,
	MinLength,
  } from 'class-validator';
  
  export class LoginWithTokenDTO {
	@IsEmail()
	@IsString()
	@MinLength(5)
	email: string;
  
	@IsString()
	token: string;
  }
  
  export class LoginDTO {
	@IsEmail()
	@IsString()
	@MinLength(5)
	email: string;
  
	@IsString()
	@MinLength(6)
	@MaxLength(25)
	password: string;
  }
  
  export class RegisterDTO extends LoginDTO {
	@IsString()
	@MinLength(2)
	@MaxLength(15)
	username: string;

	id: number;

	login: string;

	ft_id: number;
	
	@IsOptional()
	avatar: string;

	twofa: boolean;
  }
  
  export class UpdateUserDTO {

	@IsEmail()
	email: string;
  
	@IsString()
	@IsOptional()
	image: string;

	@IsString()
	username: string;

	@IsNumber()
	id: number;
  }

  export class CreateUserDTO {
	@IsString()
	username: string;

	@IsString()
	@IsEmail()
	mail: string;
	}
	
	export const jwtConstants = {
    secret: 'secretKey',
	};