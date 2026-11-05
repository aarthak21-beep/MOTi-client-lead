/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  List,
  Columns,
  MoreVertical,
  Edit2,
  Trash2,
  Phone,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ChevronRight,
  IndianRupee,
  CheckSquare,
} from 'lucide-react';
import { Lead, PricingPlan, Project, ProjectStage, ProjectTaskItem } from '../types';
import { Modal } from '../components/Modal';
import { deleteProject, saveProject, updateProjectProgress, updateProjectStage } from '../services/storage';
import { formatCurrency, formatDate, getStageBadge, maskPhone } from '../utils/formatters';

interface ProjectsViewProps {
  projects: Project[];
  leads: Lead[];
  pricingPlans: PricingPlan[];
  privacyMode: boolean;
  onNavigateToDelivery: (project: Project) => void;
  onNavigateToPayment: (project: Project) => void;
  searchQuery: string;
}

const STAGES: ProjectStage[] = [
  'Enquiry',
  'Discussion',
  'Advance Received',
  'Design',
  'Development',
  'Client Review',
  'Final Payment',
  'Delivered',
];

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  leads,
  pricingPlans,
  privacyMode,
  onNavigateToDelivery,
  onNavigateToPayment,
  searchQuery,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  const [showCredentials, setShowCredentials] = useState(false);

  // Form
  const [formData, setFormData] = useState<Partial<Project>>({
    projectName: '',
    clientName: '',
    clientBusiness: '',
    clientPhone: '',
    clientEmail: '',
    selectedPackage: 'Business Website',
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    stage: 'Design',
    progress: 50,
    totalAmount: 4999,
    advancePaid: 2500,
    remainingAmount: 2499,
    notes: '',
    liveUrl: '',
    domainInfo: '',
    hostingPlatform: 'Hostinger Cloud',
    credentialsSecure: '',
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.projectName.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      p.clientBusiness.toLowerCase().includes(q);
    const matchesStage = selectedStageFilter === 'all' || p.stage === selectedStageFilter;
    return matchesSearch && matchesStage;
  });

  const handleOpenAdd = () => {
    setEditingProject(null);
    const today = new Date();
    const deadline = new Date();
    deadline.setDate(today.getDate() + 5);

    setFormData({
      projectName: '',
      clientName: leads[0]?.name || '',
      clientBusiness: leads[0]?.businessName || '',
      clientPhone: leads[0]?.phone || '',
      clientEmail: leads[0]?.email || '',
      selectedPackage: 'Business Website',
      startDate: today.toISOString().split('T')[0],
      deadline: deadline.toISOString().split('T')[0],
      stage: 'Advance Received',
      progress: 35,
      totalAmount: 4999,
      advancePaid: 2500,
      remainingAmount: 2499,
      notes: '',
      liveUrl: '',
      domainInfo: '',
      hostingPlatform: 'Hostinger Cloud',
      credentialsSecure: '',
    });
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({ ...project });
    setIsAddEditOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.projectName || !formData.clientName) {
      alert('Please provide Project Name and Client Name.');
      return;
    }

    const payload: Project = {
      id: editingProject ? editingProject.id : 'proj-' + Date.now(),
      projectName: formData.projectName || '',
      clientName: formData.clientName || '',
      clientBusiness: formData.clientBusiness || formData.clientName || '',
      clientPhone: formData.clientPhone || '',
      clientEmail: formData.clientEmail,
      leadId: formData.leadId,
      selectedPackage: formData.selectedPackage || 'Business Website',
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      deadline: formData.deadline || new Date().toISOString().split('T')[0],
      stage: (formData.stage as ProjectStage) || 'Design',
      progress: Number(formData.progress) || 50,
      totalAmount: Number(formData.totalAmount) || 4999,
      advancePaid: Number(formData.advancePaid) || 2500,
      remainingAmount: Math.max(0, (Number(formData.totalAmount) || 4999) - (Number(formData.advancePaid) || 2500)),
      notes: formData.notes || '',
      liveUrl: formData.liveUrl,
      domainInfo: formData.domainInfo,
      hostingPlatform: formData.hostingPlatform,
      credentialsSecure: formData.credentialsSecure,
      tasks: editingProject ? editingProject.tasks : [
        { id: 't1', title: 'Content & Logo collection', completed: true },
        { id: 't2', title: 'Design & Wireframe layout', completed: true },
        { id: 't3', title: 'Responsive Development', completed: false },
        { id: 't4', title: 'Client review & revisions', completed: false },
        { id: 't5', title: 'Final deployment & domain pointing', completed: false },
      ],
      createdAt: editingProject ? editingProject.createdAt : new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    saveProject(payload);
    setIsAddEditOpen(false);
    if (viewingProject && viewingProject.id === payload.id) {
      setViewingProject(payload);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this project record?')) {
      deleteProject(id);
      if (viewingProject?.id === id) {
        setViewingProject(null);
      }
    }
  };

  const handleToggleTask = (project: Project, taskId: string) => {
    const updatedTasks = project.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const completedCount = updatedTasks.filter((t) => t.completed).length;
    const autoProgress = Math.round((completedCount / updatedTasks.length) * 100);

    const updated = {
      ...project,
      tasks: updatedTasks,
      progress: autoProgress,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    saveProject(updated);
    if (viewingProject && viewingProject.id === project.id) {
      setViewingProject(updated);
    }
  };

  const handleAddNewTaskToProject = (project: Project) => {
    if (!newTaskTitle.trim()) return;
    const newTask: ProjectTaskItem = {
      id: 'task-' + Date.now(),
      title: newTaskTitle.trim(),
      completed: false,
    };
    const updated = {
      ...project,
      tasks: [...(project.tasks || []), newTask],
    };
    saveProject(updated);
    setNewTaskTitle('');
    if (viewingProject && viewingProject.id === project.id) {
      setViewingProject(updated);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & View Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-cyan-400" />
            Project Management & Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            Track client website stages from Enquiry → Discussion → Advance → Design → Development → Review → Final Payment → Delivered.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-white/10 bg-slate-900/65 backdrop-blur-xl p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>+ New Project</span>
          </button>
        </div>
      </div>

      {/* Stage Flow Indicator Strip */}
      <div className="hidden lg:flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/65 backdrop-blur-xl p-3 text-xs overflow-x-auto">
        {STAGES.map((st, idx) => {
          const count = projects.filter((p) => p.stage === st).length;
          const isLast = idx === STAGES.length - 1;
          const badge = getStageBadge(st);
          return (
            <React.Fragment key={st}>
              <button
                onClick={() => setSelectedStageFilter(selectedStageFilter === st ? 'all' : st)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                  selectedStageFilter === st
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
                <span>{st}</span>
                <span className="rounded-full bg-slate-800/80 px-1.5 py-0.2 text-[10px] font-mono">
                  {count}
                </span>
              </button>
              {!isLast && <ChevronRight className="h-3.5 w-3.5 text-slate-700 shrink-0" />}
            </React.Fragment>
          );
        })}
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 items-start">
          {STAGES.map((stage) => {
            const stageProjects = filteredProjects.filter((p) => p.stage === stage);
            const badge = getStageBadge(stage);
            return (
              <div
                key={stage}
                className="w-80 shrink-0 rounded-2xl border border-white/10 bg-slate-950/55 backdrop-blur-xl p-3 flex flex-col max-h-[75vh]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10/80">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${badge.dot}`} />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      {stage}
                    </h3>
                  </div>
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
                    {stageProjects.length}
                  </span>
                </div>

                {/* Cards List in Stage */}
                <div className="mt-3 flex-1 overflow-y-auto space-y-3 pr-1">
                  {stageProjects.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-slate-600 border border-dashed border-white/10/80 rounded-xl">
                      No projects here
                    </div>
                  ) : (
                    stageProjects.map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => setViewingProject(proj)}
                        className="group rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-sm hover:border-cyan-500/50 hover:shadow-cyan-500/5 transition-all cursor-pointer space-y-3"
                      >
                        <div>
                          <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded-md">
                            {proj.selectedPackage}
                          </span>
                          <h4 className="mt-2 text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {proj.projectName}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {proj.clientBusiness} ({proj.clientName})
                          </p>
                        </div>

                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Progress</span>
                            <span className="font-mono font-bold text-cyan-400">{proj.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                              style={{ width: `${proj.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Financials & Deadline */}
                        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10/70 pt-2 font-mono">
                          <span>
                            Total: <strong className="text-slate-200">{formatCurrency(proj.totalAmount, privacyMode)}</strong>
                          </span>
                          <span className="text-amber-400">
                            Due: {formatCurrency(proj.remainingAmount, privacyMode)}
                          </span>
                        </div>

                        {/* Quick Stage advance button */}
                        <div
                          className="flex items-center justify-between pt-1 border-t border-white/10/50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-[10px] text-slate-500">
                            Deadline: {formatDate(proj.deadline)}
                          </span>

                          {stage !== 'Delivered' && (
                            <button
                              onClick={() => {
                                const currentIndex = STAGES.indexOf(stage);
                                if (currentIndex < STAGES.length - 1) {
                                  updateProjectStage(proj.id, STAGES[currentIndex + 1]);
                                }
                              }}
                              className="flex items-center gap-1 rounded-lg bg-slate-800/90 hover:bg-cyan-500 hover:text-slate-950 px-2 py-1 text-[10px] font-bold text-slate-300 transition-colors"
                              title="Advance to next project stage"
                            >
                              <span>Next Stage</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/65 backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Project & Client</th>
                  <th className="py-3.5 px-4">Package</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4">Progress</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4 text-right">Balance Due</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProjects.map((proj) => {
                  const stageBadge = getStageBadge(proj.stage);
                  return (
                    <tr
                      key={proj.id}
                      onClick={() => setViewingProject(proj)}
                      className="hover:bg-slate-900/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm group-hover:text-cyan-300">
                          {proj.projectName}
                        </div>
                        <div className="text-slate-400 text-xs">
                          {proj.clientBusiness} • {proj.clientName}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                          {proj.selectedPackage}
                        </span>
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={proj.stage}
                          onChange={(e) => updateProjectStage(proj.id, e.target.value as ProjectStage)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${stageBadge.bg} ${stageBadge.text} border-0`}
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s} className="bg-slate-900 text-white">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 w-36">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                              style={{ width: `${proj.progress}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-cyan-400 font-bold">
                            {proj.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {formatDate(proj.deadline)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">
                        {formatCurrency(proj.remainingAmount, privacyMode)}
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(proj)}
                            className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:text-white"
                            title="Edit Project"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(proj.id)}
                            className="rounded-lg border border-rose-500/30 bg-rose-500/15 p-1.5 text-rose-400 hover:bg-rose-500/25"
                            title="Delete Project"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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
      )}

      {/* Project Detail & Checklist Drawer Modal */}
      {viewingProject && (
        <Modal
          isOpen={!!viewingProject}
          onClose={() => setViewingProject(null)}
          title={viewingProject.projectName}
          subtitle={`${viewingProject.clientBusiness} • ${viewingProject.selectedPackage}`}
          maxWidth="3xl"
        >
          <div className="space-y-5">
            {/* Stage & Progress Strip */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                    Current Milestone
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStageBadge(viewingProject.stage).bg} ${getStageBadge(viewingProject.stage).text}`}>
                      {viewingProject.stage}
                    </span>
                    <span className="text-xs text-slate-400">
                      Started: {formatDate(viewingProject.startDate)} • Deadline: {formatDate(viewingProject.deadline)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onNavigateToPayment(viewingProject);
                      setViewingProject(null);
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/25"
                  >
                    <IndianRupee className="h-3.5 w-3.5" />
                    <span>Record Payment</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigateToDelivery(viewingProject);
                      setViewingProject(null);
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/25"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Handover Details</span>
                  </button>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Development Progress</span>
                  <span className="font-mono font-bold text-cyan-400">{viewingProject.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={viewingProject.progress}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    updateProjectProgress(viewingProject.id, val);
                    setViewingProject({ ...viewingProject, progress: val });
                  }}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>

            {/* Checklist of Tasks */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <CheckSquare className="h-4 w-4 text-cyan-400" />
                  Assigned Project Tasks & Checklist ({viewingProject.tasks?.filter((t) => t.completed).length || 0} / {viewingProject.tasks?.length || 0})
                </h4>
              </div>

              <div className="space-y-1.5">
                {viewingProject.tasks?.map((task) => (
                  <label
                    key={task.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-white/10/80 bg-slate-900/50 hover:bg-slate-800/50 cursor-pointer text-xs select-none transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(viewingProject, task.id)}
                        className="rounded-sm border-slate-700 bg-slate-900 text-cyan-500"
                      />
                      <span className={task.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                        {task.title}
                      </span>
                    </div>
                    {task.completed && (
                      <span className="text-[10px] text-emerald-400 font-semibold">Done</span>
                    )}
                  </label>
                ))}
              </div>

              {/* Add Task input */}
              <div className="flex gap-2 pt-2 border-t border-white/10">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewTaskToProject(viewingProject);
                    }
                  }}
                  placeholder="Add custom task (e.g. Integrate Razorpay key)..."
                  className="flex-1 rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => handleAddNewTaskToProject(viewingProject)}
                  className="rounded-xl bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 shrink-0"
                >
                  + Add Task
                </button>
              </div>
            </div>

            {/* Financial Status & Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 space-y-2 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
                  Financial Breakdown
                </h4>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Project Value:</span>
                  <strong className="text-white font-mono">{formatCurrency(viewingProject.totalAmount, privacyMode)}</strong>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Advance Received (50%):</span>
                  <strong className="font-mono">+{formatCurrency(viewingProject.advancePaid, privacyMode)}</strong>
                </div>
                <div className="flex justify-between text-amber-400 font-bold border-t border-white/10 pt-1">
                  <span>Remaining Balance:</span>
                  <strong className="font-mono">{formatCurrency(viewingProject.remainingAmount, privacyMode)}</strong>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[11px] flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-cyan-400" />
                    Hosting & Secure Credentials
                  </h4>
                  <button
                    onClick={() => setShowCredentials(!showCredentials)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    {showCredentials ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p className="text-slate-300">
                  Hosting: <strong>{viewingProject.hostingPlatform || 'Hostinger'}</strong>
                </p>
                <p className="text-slate-300">
                  Domain: <strong>{viewingProject.domainInfo || 'Not specified'}</strong>
                </p>
                {showCredentials ? (
                  <pre className="rounded-lg bg-slate-950 p-2 font-mono text-[11px] text-emerald-300 whitespace-pre-wrap">
                    {viewingProject.credentialsSecure || 'cPanel: user@moti.host / pass: ••••••••••'}
                  </pre>
                ) : (
                  <p className="text-[11px] text-slate-500 font-mono">•••••••••••••••• (Encrypted in storage)</p>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Project Modal */}
      {isAddEditOpen && (
        <Modal
          isOpen={isAddEditOpen}
          onClose={() => setIsAddEditOpen(false)}
          title={editingProject ? 'Edit Project Details' : 'Start New Website Project'}
          subtitle="Configure deliverables, timeline, package and financial details"
          maxWidth="3xl"
        >
          <form onSubmit={handleSaveProject} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="e.g. Patil Classes 5-Page Website"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Selected Website Package
                </label>
                <select
                  value={formData.selectedPackage}
                  onChange={(e) => {
                    const pkg = e.target.value;
                    const plan = pricingPlans.find((p) => p.name.includes(pkg) || pkg.includes(p.name));
                    const price = plan ? plan.price : 4999;
                    setFormData({
                      ...formData,
                      selectedPackage: pkg,
                      totalAmount: price,
                      advancePaid: Math.round(price * 0.5),
                      remainingAmount: Math.round(price * 0.5),
                    });
                  }}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                >
                  <option value="Starter Website">Starter Website (₹2,999)</option>
                  <option value="Business Website">Business Website (₹4,999)</option>
                  <option value="Premium Corporate">Premium Corporate (₹7,999)</option>
                  <option value="E-Commerce Store">E-Commerce Store (₹12,999)</option>
                  <option value="Custom Bespoke">Custom Bespoke Website</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Client / Owner Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Sachin Patil"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-2.5 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.clientBusiness}
                  onChange={(e) => setFormData({ ...formData, clientBusiness: e.target.value })}
                  placeholder="e.g. Patil Classes"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-2.5 px-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Client Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  placeholder="+91 98221 44550"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-2.5 px-3 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Stage
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value as ProjectStage })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-2.5 px-3 text-xs text-white focus:border-cyan-500 focus:outline-hidden"
                >
                  {STAGES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Total Project Amount (₹)</label>
                <input
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">50% Advance Received (₹)</label>
                <input
                  type="number"
                  value={formData.advancePaid}
                  onChange={(e) => setFormData({ ...formData, advancePaid: Number(e.target.value) })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Progress Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project Notes & Specific Client Requests
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Domain registrar, specific color schemes, WhatsApp notification preferences..."
                className="w-full rounded-xl border border-white/10 bg-slate-900 py-2 px-3 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAddEditOpen(false)}
                className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
              >
                {editingProject ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
