import { IPerson, Person } from "../../interfaces/Person";
import { useDispatch, useSelector } from "react-redux";
import {
  PersonState,
  setData,
  setPersons,
} from "../../features/person/personSlice";
import { PersonService } from "../../services/person.services";
import Swal from "sweetalert2";
import { useState } from "react";

export const Form = () => {
  const { person } = useSelector((state: { person: PersonState }) => state);

  const [errorForm, setErrorForm] = useState({
    name: false,
    addres: false,
    phone: false,
  });

  const dispatch = useDispatch();

  const personService = new PersonService();

  const setFormValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setData({ ...person.data, [event.target.id]: event.target.value })
    );
  };

  const isValidForm = () => {
    const error = { name: false, addres: false, phone: false };

    if (!person.data.name) error.name = true;
    if (!person.data.address) error.addres = true;
    if (!person.data.phone) error.phone = true;

    setErrorForm(error);

    return error.name || error.addres || error.phone;
  };

  const fetchUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const data: IPerson = await personService.put(person.data);
      // add item
      const dataArray: IPerson[] = [...person.list];
      // search index
      let index: number = dataArray.findIndex(
        (item: IPerson) => item.id === data.id
      );
      // replace item
      dataArray.splice(index, 1, data);
      //update item
      dispatch(setPersons(dataArray));
      // for clean form
      dispatch(setData(new Person()));

      Swal.fire({
        icon: "success",
        title: "The data has been updated",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      // valid fields
      if (isValidForm()) return null;

      const data: IPerson = await personService.post(person.data);
      // for clean form
      dispatch(setData(new Person()));
      // add item
      const dataArray: IPerson[] = [...person.list];
      dataArray.push(data);
      dispatch(setPersons(dataArray));

      Swal.fire({
        icon: "success",
        title: "The data has been saved",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const inputCSS =
    "block w-full px-5 py-2.5 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 ";
  const inputError = "border-red-400";

  return (
    <div className="px-8 py-4 pb-8 rounded-lg bg-gray-50">
      <form
        onSubmit={(e) => (person.data.id ? fetchUpdate(e) : fetchCreate(e))}
      >
        <div className="mt-4">
          <label className="mb-2  text-gray-800">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            value={person.data.name}
            onChange={(e) => setFormValue(e)}
            className={errorForm.name ? inputCSS + inputError : inputCSS}
          />
          {errorForm.name && (
            <p className="mt-1 text-m text-red-400">
              This is field is required
            </p>
          )}
        </div>

        <div className="mt-4">
          <label className="mb-2  text-gray-800">Address</label>
          <input
            id="address"
            type="text"
            placeholder="Address"
            value={person.data.address}
            onChange={(e) => setFormValue(e)}
            className={errorForm.addres ? inputCSS + inputError : inputCSS}
          />
          {errorForm.addres && (
            <p className="mt-1 text-m text-red-400">
              This is field is required
            </p>
          )}
        </div>

        <div className="mt-4">
          <label className="mb-2  text-gray-800">Phone</label>
          <input
            id="phone"
            type="text"
            placeholder="88888888"
            value={person.data.phone}
            onChange={(e) => setFormValue(e)}
            className={errorForm.phone ? inputCSS + inputError : inputCSS}
          />
          {errorForm.phone && (
            <p className="mt-1 text-m text-red-400">
              This is field is required
            </p>
          )}
        </div>

        <button className="w-full mt-8 bg-teal-600 text-gray-50 font-semibold py-2 px-4 rounded-lg">
          {person.data.id ? "Save" : "Create"}
        </button>
      </form>
    </div>
  );
};
