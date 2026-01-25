import { ReactNode } from "react";
import KambazNavigation from "../Navigation";
import AccountNavigation from "./Navigation";
export default function AccountLayout({ children }: Readonly<{ children: ReactNode }>) {
 return (
   <table>
     <tbody>
       <tr>
         <td valign="top" width="200">  <KambazNavigation /> </td>
         <td valign="top" width="100%">
           <div id="wd-kambaz">
             <table>
               <tbody>
                 <tr>
                   <td valign="top">              <AccountNavigation /> </td>
                   <td valign="top" width="100%"> {children}            </td>
                 </tr>
               </tbody>
             </table>
           </div>
         </td>
       </tr>
     </tbody>
   </table>
);}
