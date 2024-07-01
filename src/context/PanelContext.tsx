import { createStore } from 'solid-js/store'
import { createContext, createEffect, useContext } from 'solid-js'
import type { DataPanelConfig } from '@/components/panel/types'

function getSavedPanels() {
  return JSON.parse(localStorage.getItem('panels') || '[]') as DataPanelConfig[]
}

function usePanelState() {
  const [panels, setPanels] = createStore<DataPanelConfig[]>(getSavedPanels())

  function addPanel(panel: DataPanelConfig) {
    setPanels(panels => [...panels, panel])
  }

  function removePanel(uuid: string) {
    setPanels(panels => panels.filter(panel => panel.uuid !== uuid))
  }

  function updatePanel(uuid: string, newPanel: DataPanelConfig) {
    setPanels(panels => panels.map(panel => panel.uuid === uuid ? newPanel : panel))
  }

  // Save panels to localStorage
  createEffect(() => {
    localStorage.setItem('panels', JSON.stringify(panels))
  })

  return { panels, addPanel, removePanel, updatePanel }
}

const PanelContext = createContext<ReturnType<typeof usePanelState>>()

export function PanelProvider(props: { children: any }) {
  const value = usePanelState()
  return <PanelContext.Provider value={value} children={props.children} />
}

export function usePanel() {
  return useContext(PanelContext)!
}
