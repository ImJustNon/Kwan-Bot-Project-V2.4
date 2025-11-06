import mongoose, { Schema, Document } from 'mongoose';

export interface SchemaInterface extends Document {
    guild_id: string;
    role_id: string;
    author_id: string;
    updated_at: Date;
    created_at: Date;
}

const schema: Schema = new Schema<SchemaInterface>({
    guild_id: {
        type: String,
        required: true,
    },
    role_id: {
        type: String,
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

export const GuildAutoRoles = mongoose.model<SchemaInterface>('GuildAutoRoles', schema);