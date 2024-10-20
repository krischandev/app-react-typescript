import { useDispatch, useSelector } from "react-redux";
import { IPerson, Person } from "../../interfaces/Person";
import {
  PersonState,
  setData,
  setPersons,
} from "../../features/person/personSlice";
import { useEffect } from "react";
import { PersonService } from "../../services/person.services";
import Swal from "sweetalert2";

export const Table = () => {
  const { person } = useSelector((state: { person: PersonState }) => state);

  const personService = new PersonService();

  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      const res: IPerson[] = await personService.getAll();
      dispatch(setPersons(res));
    } catch (error) {
      console.log("Error to failed load ==>", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onClickDelete = (item: IPerson) => {
    Swal.fire({
      title: "Are you sure you want to delete?",
      showCancelButton: true,
      confirmButtonText: "Confirm",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        fetchDelete(item);
      }
    });
  };

  const fetchDelete = async (item: IPerson) => {
    try {
      await personService.delete(item);

      Swal.fire({
        icon: "success",
        title: "the item has been deleted",
        showConfirmButton: false,
      });

      fetchData();
    } catch (error) {
      console.log("Error to failed load ==>", error);
    }
  };

  const onClickInfo = async (item: IPerson) => {
    try {
      const data: IPerson = await personService.getById(item.id!);

      Swal.fire({
        title: "Details",
        icon: "info",
        html:
          `<b>Name</b> : ${data.name} <br>` +
          `<b>Address</b> : ${data.address} <br>` +
          `<b>Phone</b> : ${data.phone} <br>`,
        showCloseButton: false,
        showCancelButton: false,
        confirmButtonText: "Ok",
      });
    } catch (error) {
      console.log("Error ==>", error);
    }
  };

  return (
    <div className="inline-block">
      <button
        className="bg-teal-600 text-gray-50 font-semibold py-2 px-4 rounded-lg"
        onClick={() => dispatch(setData(new Person()))}
      >
        New
      </button>

      <div className="overflow-hidden border border-gray-200 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-800">
            <tr>
              <th
                scope="col"
                className="px-12 py-3.5 text-slate-50 font-medium text-left"
              >
                Name
              </th>

              <th
                scope="col"
                className="px-4 py-3.5 text-slate-50 font-medium text-left"
              >
                Address
              </th>

              <th
                scope="col"
                className="px-4 py-3.5 text-slate-50 font-medium text-left"
              >
                Phone
              </th>

              <th
                scope="col"
                className="px-4 py-3.5 text-slate-50 font-medium text-left"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {person.list.map((item: IPerson, i) => {
              return (
                <tr key={i}>
                  <td className="px-12 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {item.address}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{item.phone}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-x-6">
                      <button
                        className="bg-sky-600 text-sky-50 font-semibold py-2 px-4 rounded-lg"
                        onClick={() => onClickInfo(item)}
                      >
                        Info
                      </button>

                      <button
                        className="bg-gray-600 text-gray-50 font-semibold py-2 px-4 rounded-lg"
                        onClick={() => dispatch(setData(item))}
                      >
                        Edit
                      </button>

                      <button
                        className="bg-red-600 text-gray-50 font-semibold py-2 px-4 rounded-lg"
                        onClick={() => onClickDelete(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
