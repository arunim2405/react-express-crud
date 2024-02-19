import React, { useState, useEffect } from "react"
import axios from "axios"
import CandidateTable from "./CandidateTable"
import AddModifyCandidateModal from "./AddModifyCandidateModal"

const App = () => {
  const [candidates, setCandidates] = useState([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState("add")
  const [candidateDetails, setCandidateDetails] = useState({})
  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      const response = await axios.get("https://applicant-tracker.onrender.com/candidates")
      console.log("Candidates fetched:", response.data)
      setCandidates(response.data)
    } catch (error) {
      console.error("Error fetching candidates:", error)
    }
  }

  const editCandidate = candidate => {
    setCandidateDetails(candidate)
    setModalMode("edit")
    setIsAddModalOpen(true)
  }

  return (
    <div>
      <div className="mx-12 p-4">
        <h1 className="text-3xl font-bold mb-4">Recruiter Tool</h1>

        <div>
          <CandidateTable candidates={candidates} setCandidates={setCandidates} setIsAddModalOpen={setIsAddModalOpen} editCandidate={editCandidate} />
        </div>
      </div>
      <AddModifyCandidateModal isOpen={isAddModalOpen} setIsOpen={setIsAddModalOpen} setCandidates={setCandidates} mode={modalMode} candidateDetails={candidateDetails} />
    </div>
  )
}

export default App
