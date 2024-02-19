import { useEffect, useState } from "react"
import { Dialog } from "@headlessui/react"
import { useImmer } from "use-immer"
import axios from "axios"
function AddModifyCandidateModal(props) {
  const { isOpen, setIsOpen, candidateDetails, mode = "new", setCandidates } = props
  useEffect(() => {
    if (isOpen && mode === "edit") {
      setNewCandidate(draft => {
        draft.name = candidateDetails.name
        draft.email = candidateDetails.email
        draft.phone = candidateDetails.phone
        draft.skills = candidateDetails.skills
        draft.status = candidateDetails.status
        draft.expected_salary = candidateDetails.expected_salary
        draft.candidateId = candidateDetails.id
      })
    }
  }, [isOpen, mode])
  const [newCandidate, setNewCandidate] = useImmer({
    name: "",
    email: "",
    phone: "",
    skills: [],
    status: "",
    expected_salary: "",
    candidateId: ""
  })
  const resetCandidateDetails = () => {
    setNewCandidate(draft => {
      draft.name = ""
      draft.email = ""
      draft.phone = ""
      draft.skills = []
      draft.status = ""
      draft.expected_salary = ""
      draft.candidateId = ""
    })
  }

  const handleSubmit = async event => {
    event.preventDefault()
    console.log("newCandidate", newCandidate)
    try {
      if (mode === "edit") {
        let allDetails = { ...newCandidate }
        delete allDetails.candidateId
        const response = await axios.patch(`http://localhost:3002/candidates/${newCandidate.candidateId}`, allDetails)
        console.log("Candidate updated:", response.data)
        setCandidates(prevCandidates => {
          const index = prevCandidates.findIndex(candidate => candidate.id === newCandidate.candidateId)
          prevCandidates[index] = response.data
          return prevCandidates
        })
        setNewCandidate({
          name: "",
          email: "",
          phone: "",
          skills: [],
          status: "",
          expected_salary: ""
        })
        setIsOpen(false)
      } else {
        const response = await axios.post("http://localhost:3002/candidates", newCandidate)
        console.log("Candidate added:", response.data)
        setCandidates(prevCandidates => [...prevCandidates, response.data])
        setNewCandidate({
          name: "",
          email: "",
          phone: "",
          skills: [],
          status: "",
          expected_salary: ""
        })
      }
    } catch (error) {
      console.error("Error adding candidate:", error)
    }
  }
  const handleChange = event => {
    console.log("event.target.name", event.target.name)
    console.log("event.target.value", event.target.value)
    setNewCandidate(prevCandidate => ({
      ...prevCandidate,
      [event.target.name]: event.target.value
    }))
  }

  const handleDeleteCandidate = async () => {
    try {
      const response = await axios.delete(`http://localhost:3002/candidates/${newCandidate.candidateId}`)
      console.log("Candidate deleted:", response.data)
      setCandidates(prevCandidates => {
        return prevCandidates.filter(candidate => candidate.id !== newCandidate.candidateId)
      })
      setNewCandidate({
        name: "",
        email: "",
        phone: "",
        skills: [],
        status: "",
        expected_salary: ""
      })
      setIsOpen(false)
    } catch (error) {
      console.error("Error deleting candidate:", error)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
        resetCandidateDetails()
      }}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="w-full max-w-5xl rounded bg-white p-14">
          <Dialog.Title className="mb-2">{mode === "edit" ? "Update Candidate Details" : "Add Candidate Details"}</Dialog.Title>
          {/* <Dialog.Description>This will permanently deactivate your account</Dialog.Description> */}

          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" value={newCandidate.name} onChange={handleChange} required className="mb-2 p-2 w-full border rounded-md" />
            <input type="email" name="email" placeholder="Email" value={newCandidate.email} onChange={handleChange} required className="mb-2 p-2 w-full border rounded-md" />
            <input type="text" name="phone" placeholder="Phone" value={newCandidate.phone} onChange={handleChange} required className="mb-2 p-2 w-full border rounded-md" />

            {/* <input type="text" name="skills" placeholder="Skills" value={newCandidate.skills} onChange={handleChange} required className="mb-2 p-2 w-full border rounded-md" /> */}
            {/* <input type="text" name="status" placeholder="Status" value={newCandidate.status} onChange={handleChange} required className="mb-2 p-2 w-full border rounded-md" /> */}

            <select
              id="status"
              class="mb-2 p-2 w-full border rounded-md"
              onChange={evt => {
                setNewCandidate(draft => {
                  draft.status = evt.target.value
                })
              }}
              value={newCandidate.status}
            >
              <option selected>Select a status*</option>
              <option value="Contacted">Contacted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Offer Extended">Offer Extended</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
            <input
              type="number"
              name="expected_salary"
              placeholder="Expected Salary in INR"
              value={newCandidate.expected_salary}
              onChange={handleChange}
              required
              className="mb-2 p-2 w-full border rounded-md"
            />
            <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Skills
            </label>
            {newCandidate?.skills &&
              newCandidate?.skills?.map((skill, index) => {
                return (
                  <div className="flex gap-x-4 align-middle">
                    <input
                      type="text"
                      name="skills"
                      placeholder="Skill"
                      value={skill.name}
                      onChange={evt => {
                        setNewCandidate(draft => {
                          draft.skills[index].name = evt.target.value
                        })
                      }}
                      required
                      className="mb-2 p-2 w-full border rounded-mr"
                    />
                    <input
                      type="number"
                      name="experience"
                      placeholder="Experience"
                      value={skill.experience}
                      onChange={evt => {
                        setNewCandidate(draft => {
                          draft.skills[index].experience = evt.target.value
                        })
                      }}
                      required
                      className="mb-2 p-2 w-full border rounded-md"
                    />
                    <p
                      className="text-red-500 mb-2 text-right text-sm font-medium cursor-pointer flex-1"
                      onClick={() => {
                        setNewCandidate(draft => {
                          draft.skills.splice(index, 1)
                        })
                      }}
                    >
                      Remove
                    </p>
                  </div>
                )
              })}

            {newCandidate?.skills?.length === 0 && <p className=" mb-2  text-sm font-medium cursor-pointer">No skills added</p>}
            <p
              className="text-blue-500 mb-2 text-right text-sm font-medium cursor-pointer"
              onClick={() => {
                setNewCandidate(draft => {
                  if (!draft.skills) draft.skills = []
                  draft.skills.push({
                    name: "",
                    experience: 0
                  })
                })
              }}
            >
              Add Skill
            </p>
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md mb-2 pt-2" onClick={() => {}}>
              {mode === "edit" ? "Update" : "Add Candidate"}
            </button>
          </form>
          {mode === "edit" && (
            <button
              className="w-full bg-red-500 text-white p-2 rounded-md "
              onClick={() => {
                handleDeleteCandidate()
              }}
            >
              Delete
            </button>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default AddModifyCandidateModal
