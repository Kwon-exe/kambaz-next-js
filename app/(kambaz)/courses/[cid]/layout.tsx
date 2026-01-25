import { ReactNode } from "react";
import KambazNavigation from "../../Navigation";
import CourseNavigation from "./Navigation";
export default async function CoursesLayout(
  { children, params }: Readonly<{ children: ReactNode; params: Promise<{ cid: string }> }>) {
 const { cid } = await params;
 return (
   <table>
     <tbody>
       <tr>
         <td valign="top" width="200">  <KambazNavigation /> </td>
         <td valign="top" width="100%">
           <div id="wd-courses">
             <h2>Courses {cid}</h2>
             <hr />
             <table>
               <tbody>
                 <tr>
                   <td valign="top" width="200"> <CourseNavigation /> </td>
                   <td valign="top" width="100%"> {children} </td>
                 </tr>
               </tbody>
             </table>
           </div>
         </td>
       </tr>
     </tbody>
   </table>
);}
