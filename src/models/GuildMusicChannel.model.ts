import mongoose, { Schema, Document } from 'mongoose';

export interface SchemaInterface extends Document {
    guild_id: string;
    channel_id: string;
    webhook_id: string;
    webhook_token: string;
    author_id: string;
    content_banner_id: string;
    content_queue_id: string;
    content_playing_id: string;
    updated_at: Date;
    created_at: Date;
}

const schema: Schema = new Schema<SchemaInterface>({
    guild_id: {
        type: String,
        required: true,
        unique: true
    },
    channel_id: {
        type: String,
        required: true,
        unique: true
    },
    webhook_id: {
        type: String,
        required: true,
        unique: true
    },
    webhook_token: {
        type: String,
        required: true,
        unique: true
    },
    author_id: {
        type: String,
        required: true,
    },
    content_banner_id: {
        type: String,
        required: true,
        unique: true
    },
    content_queue_id: {
        type: String,
        required: true,
        unique: true
    },
    content_playing_id: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at',
    }
});

export const GuildMusicChannel = mongoose.model<SchemaInterface>('GuildMusicChannel', schema);