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
    cid:        string,
    name:       string,
    status:     string,
    IPAddress:  string
    createdAt:  number,
    startedAt:  number,
    finishedAt: number,
}

/**
 * Define container schema
 */
const ContainerSchema = new Schema<IContainer>({
    cid:        { type: String, required: true },
    name:       { type: String, required: true },
    status:     { type: String, required: true },
    IPAddress:  { type: String, required: true },
    createdAt:  { type: Number, required: true },
    startedAt:  { type: Number, required: true },
    finishedAt: { type: Number, required: true },
});

/**
 * Create container model
 */
const ContainerModel = mongoose.model<IContainer>( 'Containers', ContainerSchema );

export default ContainerModel;
