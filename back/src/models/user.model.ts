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
	@MinLength(8)
	@MaxLength(25)
	password: string;
  }
  
  export class RegisterDTO extends LoginDTO {
	@IsString()
	@MinLength(2)
	@MaxLength(15)
	username: string;
  }
  
  export interface AuthPayload {
	username: string;
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
	userId: number;
  }

  export class createUserDTO {
	@IsString()
	username: string;

	@IsString()
	mail: string;
  }