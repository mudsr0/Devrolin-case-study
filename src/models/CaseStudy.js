import mongoose from 'mongoose'

const { Schema, models } = mongoose

const builderSchema = new Schema(
  {
    initials: { type: String },
    name: { type: String },
    expertise: { type: String },
    note: { type: String },
  },
  { _id: false }
)

const heroSchema = new Schema(
  {
    tag: { type: String },
    title: { type: String },
    body: { type: String },
    pills: [{ type: String }],
  },
  { _id: false }
)

const problemSchema = new Schema(
  {
    eyebrow: { type: String },
    heading: { type: String },
    sub: { type: String },
    pains: [{ type: String }],
  },
  { _id: false }
)

const videoSchema = new Schema(
  {
    eyebrow: { type: String },
    heading: { type: String },
    sub: { type: String },
    embedUrl: { type: String },
    label: { type: String },
    openUrl: { type: String },
  },
  { _id: false }
)

const builtItemSchema = new Schema(
  {
    num: { type: String },
    title: { type: String },
    desc: { type: String },
  },
  { _id: false }
)

const builtSchema = new Schema(
  {
    eyebrow: { type: String },
    heading: { type: String },
    sub: { type: String },
    items: [builtItemSchema],
  },
  { _id: false }
)

const outcomeItemSchema = new Schema(
  {
    num: { type: String },
    label: { type: String },
  },
  { _id: false }
)

const outcomeSchema = new Schema(
  {
    eyebrow: { type: String },
    heading: { type: String },
    sub: { type: String },
    items: [outcomeItemSchema],
  },
  { _id: false }
)

const testimonialSchema = new Schema(
  {
    eyebrow: { type: String },
    heading: { type: String },
    sub: { type: String },
    quote: { type: String },
    initials: { type: String },
    author: { type: String },
    role: { type: String },
  },
  { _id: false }
)

const processStepSchema = new Schema(
  {
    num: { type: String },
    title: { type: String },
    desc: { type: String },
  },
  { _id: false }
)

const processSchema = new Schema(
  {
    eyebrow: { type: String },
    heading: { type: String },
    sub: { type: String },
    steps: [processStepSchema],
  },
  { _id: false }
)

const ctaSchema = new Schema(
  {
    heading: { type: String },
    sub: { type: String },
    upworkUrl: { type: String },
    email: { type: String },
  },
  { _id: false }
)

const CaseStudySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String },
    clientName: { type: String },
    builder: builderSchema,
    hero: heroSchema,
    problem: problemSchema,
    video: videoSchema,
    built: builtSchema,
    outcome: outcomeSchema,
    testimonial: testimonialSchema,
    process: processSchema,
    cta: ctaSchema,
  },
  { timestamps: true }
)

export default models.CaseStudy || mongoose.model('CaseStudy', CaseStudySchema)
