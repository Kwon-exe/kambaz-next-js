import * as db from "../../../database";
import PeopleTable from "./Table";

export default function PeoplePage() {
  return <PeopleTable users={db.users} />;
}
