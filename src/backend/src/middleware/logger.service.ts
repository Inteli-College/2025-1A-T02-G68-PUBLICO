/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

@Injectable()
export class LoggerService {
  constructor(private readonly jwtService: JwtService) {}

  async logRequest(
    authHeader: string | undefined,
    ip: string,
    method: string,
    url: string,
  ) {
    const timestamp = new Date().toISOString();
    let user: string = 'Guest';
    let location: string = 'Unknown Location';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded: any = this.jwtService.verify(token);
        user = decoded.email || decoded.userId || 'Unknown User';
      } catch (error) {
        user = 'Invalid Token';
      }
    }

    if (ip === '::1' || ip === '127.0.0.1') {
      ip = 'Localhost';
      location = 'Localhost';
    } else {
      try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        if (response.data && response.data.status === 'success') {
          location = `${response.data.city}, ${response.data.country}`;
        }
      } catch (error) {
        location = 'Location not found';
      }
    }

    console.log(
      `[${timestamp}] User: ${user} | IP: ${ip} | Location: ${location} | ${method} ${url}`,
    );
  }
}
