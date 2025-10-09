import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';

import { AuthProvidersEnum } from '../../../../../auth/auth-providers.enum';
import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { StatusSchema } from '../../../../../statuses/infrastructure/persistence/document/entities/status.schema';
import { RoleSchema } from '../../../../../roles/infrastructure/persistence/document/entities/role.schema';

export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
    // unique: true,
    // sparse: true, // ✅ Cho phép nhiều doc null email
  })
  email: string | null;

  @Prop({
    type: String,
  })
  username: string | null;

  @Prop()
  password?: string;

  @Prop({
    default: AuthProvidersEnum.email,
  })
  provider: string;

  @Prop({
    type: String,
    default: null,
  })
  socialId?: string | null;

  @Prop({
    type: String,
  })
  firstName: string | null;

  @Prop({
    type: String,
  })
  lastName: string | null;

  @Prop({
    type: FileSchemaClass,
  })
  photo?: FileSchemaClass | null;

  @Prop({
    type: RoleSchema,
  })
  role?: RoleSchema | null;

  @Prop({
    type: StatusSchema,
  })
  status?: StatusSchema;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);

UserSchema.index({ 'role._id': 1 });
// ✅ Indexes hiephn add
//{ sparse: true } => MongoDB chỉ tạo index cho những document có giá trị thật (không null hoặc không bị thiếu field đó).
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ username: 1 }, { unique: true, sparse: true });
UserSchema.index({ provider: 1, socialId: 1 }, { unique: true, sparse: true });
UserSchema.index({ 'status._id': 1 });
//chỉ index những document có deletedAt=null, nếu soft delete thì không index(deletedAt!=null)
UserSchema.index(
  { deletedAt: 1 },
  { partialFilterExpression: { deletedAt: null } },
);
