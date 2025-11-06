import mongoose, { Schema, Document } from 'mongoose';

export interface SchemaInterface extends Document {
    guild_id: string,
    channel_id: string,
    author_id: string,
    updated_at: Date;
    created_at: Date;
}

const schema: Schema = new Schema<SchemaInterface>({
    guild_id: {
        type: String,
        required: true,
    },
    channel_id: {
        type: String,
        required: true,
        unique: true
    },
    author_id: {
        type: String,
        required: true,
    },
}, {
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at',
    }
});

export const GuildAutoVoiceChannel = mongoose.model<SchemaInterface>('GuildAutoVoiceChannel', schema);