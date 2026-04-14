"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import { FormControl } from "react-bootstrap";
import { RootState } from "../../store";
import PeopleTable from "../../courses/[cid]/people/Table";
import * as client from "../client";

export default function Users() {
  const router = useRouter();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  );
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");

  const fetchUsers = async () => {
    const loadedUsers = await client.findAllUsers();
    setUsers(loadedUsers);
  };

  const filterUsersByRole = async (selectedRole: string) => {
    setRole(selectedRole);
    if (selectedRole) {
      const loadedUsers = await client.findUsersByRole(selectedRole);
      setUsers(loadedUsers);
      return;
    }
    if (name) {
      const loadedUsers = await client.findUsersByPartialName(name);
      setUsers(loadedUsers);
      return;
    }
    fetchUsers();
  };

  const filterUsersByName = async (selectedName: string) => {
    setName(selectedName);
    if (selectedName) {
      const loadedUsers = await client.findUsersByPartialName(selectedName);
      setUsers(loadedUsers);
      return;
    }
    if (role) {
      const loadedUsers = await client.findUsersByRole(role);
      setUsers(loadedUsers);
      return;
    }
    fetchUsers();
  };

  const createUser = async () => {
    const user = await client.createUser({
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${Date.now()}`,
      password: "password123",
      email: `email${users.length + 1}@neu.edu`,
      section: "S101",
      role: "STUDENT",
    });
    setUsers([...users, user]);
  };

  useEffect(() => {
    if (!currentUser) {
      router.replace("/account/signin");
      return;
    }
    if (currentUser.role !== "ADMIN") {
      router.replace("/account/profile");
      return;
    }
    fetchUsers();
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== "ADMIN") {
    return null;
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="mb-0">Users</h3>
        <button
          onClick={createUser}
          className="btn btn-danger wd-add-people"
          id="wd-add-people-btn"
        >
          <FaPlus className="me-2" />
          People
        </button>
      </div>

      <div className="d-flex gap-2 mb-3">
        <FormControl
          value={name}
          onChange={(e) => filterUsersByName(e.target.value)}
          placeholder="Search people"
          className="wd-filter-by-name"
        />
        <select
          value={role}
          onChange={(e) => filterUsersByRole(e.target.value)}
          className="form-select wd-select-role"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="TA">Assistants</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrators</option>
        </select>
      </div>

      <PeopleTable users={users} fetchUsers={fetchUsers} />
    </div>
  );
}
