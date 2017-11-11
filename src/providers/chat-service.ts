import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';

export class ChatMessage {
  answer: string;
  type: string;
}

export class UserInfo {
  id: string;
  name?: string;
  avatar?: string;
}

