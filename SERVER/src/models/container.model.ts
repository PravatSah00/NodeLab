/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Defination of container model
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

import mongoose, { Schema, Document } from "mongoose";

/**
 * Define container interface
 */
export interface IContainer extends Document {
    userId:      number,
    containerId: string,
    name:        string,
    status:      string,
    IPAddress:   string
    createdAt:   string,
    startedAt:   string,
    finishedAt:  string,
}

/**
 * Define container schema
 */
const ContainerSchema = new Schema<IContainer>({
    userId:      { type: Number, required: true, unique: true },
    containerId: { type: String, required: true, unique: true },
    name:        { type: String, required: true, unique: true },
    status:      { type: String, required: true },
    IPAddress:   { type: String, required: true, unique: true },
    createdAt:   { type: String, required: true },
    startedAt:   { type: String, required: true },
    finishedAt:  { type: String, required: true },
});

/**
 * Create container model
 */
const ContainerModel = mongoose.model<IContainer>( 'Containers', ContainerSchema );

export default ContainerModel;
