import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  content: String,
  rating: {type: Number, min: 1, max: 5, default: 5}
},{
  timestamps:true
})

const animeSchema = new Schema({
  title:{
    type:String,
    require: true
  },
  releaseYear: Date,
  imageURL: String,
  genre: {
    type: String,
    enum: ['G', 'PG', 'PG-13', 'R'],
  },
  rating: Number,
  ongoing: {
    tpye: Boolean,
    require: true
  },
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