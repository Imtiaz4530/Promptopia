// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// import { connectToDB } from "@utils/database";
// import User from "@models/user";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//     }),
//   ],

//   callbacks: {
//     async session({ session }) {
//       // const sessionUser = await User.findOne({
//       //   email: session.user.email,
//       // });

//       // session.user.id = sessionUser._id.toString();

//       const sessionUser = await User.findOne({
//         email: session.user.email,
//       });

//       if (sessionUser) {
//         session.user.id = sessionUser._id.toString();
//       }

//       return session;
//     },

//     async signIn({ profile }) {
//       try {
//         await connectToDB();

//         // Check if a user alraedy exist
//         const userExists = await User.findOne({
//           email: profile.email,
//         });
//         console.log("DB Connect hoye gelo to...", userExists);
//         //if not, create new user
//         if (!userExists) {
//           await User.create({
//             email: profile.email,
//             username: profile.name.replace(" ", "").toLowerCase(),
//             image: profile.picture,
//           });
//         }

//         return true;
//       } catch (error) {
//         console.log(error);
//         return false;
//       }
//     },
//   },
// });

// export { handler as GET, handler as POST };

// Import necessary modules
import mongoose from "mongoose";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

// Connect to MongoDB
connectToDB();

// Initialize NextAuth
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async session({ session }) {
      try {
        // Ensure that the MongoDB connection is established
        if (!mongoose.connection.readyState) {
          await connectToDB();
        }

        // Perform the findOne operation
        const sessionUser = await User.findOne({
          email: session.user.email,
        });

        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }

        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session;
      }
    },

    async signIn({ profile }) {
      try {
        // Ensure that the MongoDB connection is established
        if (!mongoose.connection.readyState) {
          await connectToDB();
        }

        // Use findOneAndUpdate with upsert option
        await User.findOneAndUpdate(
          { email: profile.email },
          {
            $setOnInsert: {
              email: profile.email,
              username: profile.name.replace(" ", "").toLowerCase(),
              image: profile.picture,
            },
          },
          { upsert: true }
        );

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
