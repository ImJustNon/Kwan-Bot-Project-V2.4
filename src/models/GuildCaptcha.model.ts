import mongoose, { Schema, Document } from 'mongoose';

export interface SchemaInterface extends Document {
    guild_id: string;
    role_new_id: string;
    role_old_id?: string;
    author_id: string;
    timeout: number;
    updated_at: Date;
    created_at: Date;
}

const schema: Schema = new Schema<SchemaInterface>({
    guild_id: {
        type: String,
        required: true,
        unique: true,
    },
    role_new_id: {
        type: String,
        required: true,
    },
    role_old_id: {
        type: String,
    },
    timeout: {
        type: Number,
        required: true,
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

export const GuildCaptcha = mongoose.model<SchemaInterface>('GuildCaptcha', schema);