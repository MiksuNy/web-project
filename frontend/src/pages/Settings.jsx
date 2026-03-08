import { useState, useEffect } from "react";
import {
FiArrowLeft,
FiUser,
FiMail,
FiPhone,
FiMapPin,
FiFileText
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

export default function Settings(){

const navigate = useNavigate();

const [form,setForm] = useState({
name:"",
email:"",
phone:"",
location:"",
bio:""
});


/* LOAD USER */

useEffect(()=>{

const saved =
JSON.parse(localStorage.getItem("profileUser") || "{}");

setForm({
name:saved.name || "",
email:saved.email || "",
phone:saved.phone || "",
location:saved.location || "",
bio:saved.bio || ""
});

},[]);


/* INPUT CHANGE */

function handleChange(e){

setForm({
...form,
[e.target.name]:e.target.value
});

}


/* SAVE SETTINGS */

function saveSettings(){

localStorage.setItem(
"profileUser",
JSON.stringify(form)
);

navigate("/profile",{
state:{updatedUser:form}
});

}


return(

<div className="max-w-6xl mx-auto px-6 py-8">

{/* HEADER */}

<div className="flex items-center gap-3 mb-8">

<button
onClick={()=>navigate(-1)}
className="flex items-center gap-2 text-sm"
>

<FiArrowLeft/>
Back

</button>

<div>

<h1 className="text-xl font-semibold">
Settings
</h1>

<p className="text-sm text-muted-foreground">
Manage your account and preferences
</p>

</div>

</div>


<div className="grid md:grid-cols-4 gap-6">


{/* SIDEBAR */}

<div className="bg-card rounded-xl p-4 shadow-md h-fit">

<ul className="space-y-3 text-sm">

<li className="bg-green-100 text-green-700 px-3 py-2 rounded-md">
Account
</li>

<li className="px-3 py-2 text-muted-foreground">
Notifications
</li>

<li className="px-3 py-2 text-muted-foreground">
Privacy
</li>

<li className="px-3 py-2 text-muted-foreground">
Accessibility
</li>

</ul>

</div>



{/* FORM */}

<div className="md:col-span-3 bg-card rounded-xl shadow-md p-6 space-y-6">

<div>

<h2 className="font-semibold">
Account Information
</h2>

<p className="text-sm text-muted-foreground">
Update your personal details and profile information
</p>

</div>


{/* NAME */}

<div>

<label className="text-sm flex items-center gap-2 mb-1">

<FiUser/>
Full Name

</label>

<input
name="name"
value={form.name}
onChange={handleChange}
className="w-full border border-border rounded-md p-2"
/>

<p className="text-xs text-muted-foreground mt-1">
This name will be visible to other users
</p>

</div>


{/* EMAIL */}

<div>

<label className="text-sm flex items-center gap-2 mb-1">

<FiMail/>
Email Address

</label>

<input
name="email"
value={form.email}
onChange={handleChange}
className="w-full border border-border rounded-md p-2"
/>

<p className="text-xs text-muted-foreground mt-1">
Used for login and notifications
</p>

</div>


{/* PHONE */}

<div>

<label className="text-sm flex items-center gap-2 mb-1">

<FiPhone/>
Phone Number (Optional)

</label>

<input
name="phone"
value={form.phone}
onChange={handleChange}
className="w-full border border-border rounded-md p-2"
/>

</div>


{/* LOCATION */}

<div>

<label className="text-sm flex items-center gap-2 mb-1">

<FiMapPin/>
Location (Optional)

</label>

<input
name="location"
value={form.location}
onChange={handleChange}
className="w-full border border-border rounded-md p-2"
/>

</div>


{/* BIO */}

<div>

<label className="text-sm flex items-center gap-2 mb-1">

<FiFileText/>
Bio (Optional)

</label>

<textarea
name="bio"
value={form.bio}
onChange={handleChange}
className="w-full border border-border rounded-md p-2 h-28"
/>

<p className="text-xs text-muted-foreground mt-1">
Share your interests or what you like helping with
</p>

</div>


{/* BUTTONS */}

<div className="flex gap-3">

<button
onClick={saveSettings}
className="button-primary px-4 py-2 rounded-md"
>

Save Changes

</button>

<button
onClick={()=>navigate(-1)}
className="border border-border px-4 py-2 rounded-md"
>

Cancel

</button>

</div>


</div>

</div>

</div>

)

}