// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ArrowLeft, Camera, Mail, User, Phone, MapPin, Save } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// const Profile = () => {
//   const navigate = useNavigate();
//   const [name, setName] = useState("You");
//   const [email, setEmail] = useState("you@example.com");
//   const [phone, setPhone] = useState("");
//   const [location, setLocation] = useState("");
//   const [bio, setBio] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const initials = name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     await new Promise((r) => setTimeout(r, 800));
//     setIsLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="bg-primary/5 border-b border-border">
//         <div className="max-w-lg mx-auto px-6 py-5 flex items-center gap-3">
//           <button
//             onClick={() => navigate("/chat")}
//             className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <h1 className="text-lg font-display font-bold">Profile</h1>
//         </div>
//       </div>

//       <motion.div
//         className="max-w-lg mx-auto px-6 py-8"
//         initial={{ opacity: 0, y: 12 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.35 }}
//       >
//         {/* Avatar */}
//         <div className="flex flex-col items-center mb-8">
//           <div className="relative group">
//             <div className="w-24 h-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
//               {initials}
//             </div>
//             <button className="absolute inset-0 rounded-3xl bg-foreground/0 group-hover:bg-foreground/30 flex items-center justify-center transition-colors">
//               <Camera className="w-5 h-5 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
//             </button>
//           </div>
//           <p className="mt-3 text-lg font-semibold">{name}</p>
//           <p className="text-sm text-muted-foreground">{email}</p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSave} className="space-y-5">
//           <div>
//             <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
//               Full Name
//             </Label>
//             <div className="relative">
//               <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="pl-10 h-12 rounded-2xl bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary/20"
//               />
//             </div>
//           </div>

//           <div>
//             <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
//               Email
//             </Label>
//             <div className="relative">
//               <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="pl-10 h-12 rounded-2xl bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary/20"
//               />
//             </div>
//           </div>

//           <div>
//             <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
//               Phone
//             </Label>
//             <div className="relative">
//               <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 type="tel"
//                 placeholder="+1 (555) 000-0000"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="pl-10 h-12 rounded-2xl bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary/20"
//               />
//             </div>
//           </div>

//           <div>
//             <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
//               Location
//             </Label>
//             <div className="relative">
//               <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 placeholder="City, Country"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 className="pl-10 h-12 rounded-2xl bg-muted border-0 focus-visible:ring-2 focus-visible:ring-primary/20"
//               />
//             </div>
//           </div>

//           <div>
//             <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
//               Bio
//             </Label>
//             <textarea
//               placeholder="Tell something about yourself..."
//               value={bio}
//               onChange={(e) => setBio(e.target.value)}
//               rows={3}
//               className="w-full px-4 py-3 rounded-2xl bg-muted text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all resize-none"
//             />
//           </div>

//           <Button
//             type="submit"
//             disabled={isLoading}
//             className="w-full h-12 text-sm font-semibold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg shadow-primary/20"
//           >
//             {isLoading ? (
//               <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
//             ) : (
//               <>
//                 <Save className="w-4 h-4" />
//                 Save Changes
//               </>
//             )}
//           </Button>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default Profile;


// import axios from 'axios';
// import React, { useState } from 'react'

// const page = () => {
  
//   const {user ,isAuth,loading,setuser} = useAppData();
//   const [name,setName] = useState();
//   const [isEdit,setIsEdit] = useState(false);

//   const router = useRouter()
  
//   const editHandler = () => {
//     setIsEdit(!isEdit)
//     setName(user.name)
//   }

//   const submithanler = () => {
    
//     try {
//       const token = Cookie.get("token");
//       const {data} = await axios.post(`${"https:localhost"}/api/v1/update/name`, {name}, {
//         headers:{
//         Authorization :   `Bearer ${token}`
//         }
//       })
      
//       cookies.set("token", {
//         expire: 15,
//         path: "/",
//       })

//       // shwo the toaste aft ehr user update succfeu 
//       setuser(data.user);
//       setIsEdit(false);
      

//     } catch (error) {
//       console.log("failed to update the user name profile page",error);
//     }
//   }

//   return (
//     <div>
      
//     </div>
//   )
// }

// export default page
