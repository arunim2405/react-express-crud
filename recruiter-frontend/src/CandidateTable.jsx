import React, { useEffect, useState } from "react"
import { Dialog } from "@headlessui/react"

const getCandidateScore = candidateSkills => {
  let totalScore = 0
  if (candidateSkills.length === 0) {
    return 0
  }
  for (let i = 0; i < candidateSkills.length; i++) {
    if (candidateSkills[i].name?.toLowerCase() === "react" || candidateSkills[i].name?.toLowerCase() === "node.js") {
      if (candidateSkills[i].experience > 2) {
        totalScore += 3
      } else if (candidateSkills[i].experience >= 1) {
        totalScore += 2
      } else {
        totalScore += 1
      }
    }
  }
  return totalScore
}
const CandidateTable = props => {
  const [isViewSkillsModalOpen, setIsViewSkillsModalOpen] = useState(false)
  const [selectedCandidateSkills, setSelectedCandidateSkills] = useState([])
  return (
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
        <div class="flex-row items-center justify-between p-4 space-y-3 sm:flex sm:space-y-0 sm:space-x-4">
          <div>
            <h5 class="mr-3 font-semibold dark:text-white">Candidates</h5>
            <p class="text-gray-500 dark:text-gray-400">Manage all your existing Candidates or add a new one</p>
          </div>
          <button
            type="button"
            class="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-800 rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            onClick={() => {
              props.setIsAddModalOpen(true)
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-2 -ml-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            Add new user
          </button>
        </div>
      </div>
      <table class="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3">
              Name
            </th>
            <th scope="col" class="px-6 py-3">
              Email
            </th>

            <th scope="col" class="px-6 py-3">
              Phone
            </th>
            <th scope="col" class="px-6 py-3">
              Status
            </th>
            <th scope="col" class="px-6 py-3">
              Expected Salary
            </th>
            <th scope="col" class="px-6 py-3">
              Candidate Score
            </th>
            <th scope="col" class="px-6 py-3">
              Skills
            </th>
          </tr>
        </thead>
        <tbody>
          {props.candidates.map(candidate => {
            return (
              <tr class="odd:bg-white even:bg-gray-50 ">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  {candidate.name}
                </th>
                <td class="px-6 py-4">{candidate.email}</td>
                {/* <td class="px-6 py-4">{candidate.category}</td> */}
                <td class="px-6 py-4">{candidate.phone}</td>
                <td class="px-6 py-4">{candidate.status}</td>
                <td class="px-6 py-4">₹{candidate.expected_salary}</td>
                <td class="px-6 py-4">{getCandidateScore(candidate.skills)}</td>
                <td
                  class="px-6 py-4 text-blue-600 dark:text-blue-500 hover:underline"
                  onClick={() => {
                    setSelectedCandidateSkills(candidate.skills)
                    setIsViewSkillsModalOpen(true)
                  }}
                >
                  {"View Skills"}
                </td>
                <td class="px-6 py-4">
                  <a
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() => {
                      props.editCandidate(candidate)
                    }}
                  >
                    Edit
                  </a>
                </td>
              </tr>
            )
          })}
          {props.candidates.length === 0 && (
            <tr>
              <td colSpan="7" class="text-center p-4">
                No candidates found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Dialog open={isViewSkillsModalOpen} onClose={() => setIsViewSkillsModalOpen(false)}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 overflow-y-auto">
          <Dialog.Panel className="w-full max-w-5xl rounded bg-white p-14">
            <Dialog.Title className="mb-2">{"Skills"}</Dialog.Title>
            <ul className="list-disc pl-5">
              {selectedCandidateSkills.map(skill => {
                return (
                  <li className="mb-1 text-gray-700">
                    {skill.name} - {skill.experience} years
                  </li>
                )
              })}
            </ul>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}

export default CandidateTable
