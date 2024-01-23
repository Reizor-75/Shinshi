import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  reviewTitle: String,
  content: String,
  rating: {type: Number, min: 1, max: 5, default: 5},
  user: {type: Schema.Types.ObjectId, ref: "Profile"},
},{
  timestamps:true
})

const animeSchema = new Schema({
  title:{
    type:String,
    required: true
  },
  releaseYear: Date,
  imageURL: String,
  genre: {
    type: String,
    enum: ['action', 'comedy', 'fantasy', 'romance'],
  },
  rating: Number,
  ongoing: Boolean,
  reviews: [reviewSchema],
  // studio: {
  //   type: Schema.Types.ObjectId, ref: ""
  // },
  // voiceActors: {
  //   type: Schema.Types.ObjectId, ref: ""
  // },

},{
  timestamps: true
})

const Anime = mongoose.model("Anime", animeSchema)

export{
  Anime
}