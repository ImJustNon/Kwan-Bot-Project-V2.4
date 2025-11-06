import mongoose, { Schema, Document } from 'mongoose';

export interface SchemaInterface extends Document {
    guild_id: string;
    channel_id: string;
    channel_name: string;
    parent_id: string;
    prefix: string;
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
    },
    channel_name: {
        type: String,
        required: true,
    },
    parent_id: {
        type: String,
        required: true,
    },
    prefix: {
        type: String,
        required: true,
    },
}, {
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at',
    }
});

export const GuildServerStats = mongoose.model<SchemaInterface>('GuildServerStats', schema);