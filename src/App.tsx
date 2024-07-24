import {
  Route,
  Switch,
  MemoryRouter as Router,
  //@ts-expect-error react-router-dom5的问题
} from "react-router-dom";

import s from "./App.module.scss";
import { Bottom } from "./common/view/components";
import { routerConfig } from "./router";
import { createContext, useEffect, useState } from "react";
import LocalStorage from "./common/storage/localstorage";

export const StorageContext = createContext<{
  localStorage: LocalStorage | null;
}>({
  localStorage: null,
});

const App = () => {
  const [localStorage, setLocalStorage] = useState<LocalStorage | null>(null);
  const initData = async () => {
    const _localStorage = new LocalStorage();
    await _localStorage.init();
    setLocalStorage(_localStorage);
  };
  useEffect(() => {
    initData();
  }, []);

  return (
    <Router initialEntries={["/task-list"]}>
      <StorageContext.Provider value={{ localStorage: localStorage }}>
        <div className={s.app}>
          <div className={s.body}>
            {routerConfig.map((item) => {
              return (
                <Switch key={item.key}>
                  <Route exact path={item.key}>
                    {item.comp}
                  </Route>
                </Switch>
              );
            })}
          </div>
          <div className={s.bottom}>
            <Bottom />
          </div>
        </div>
      </StorageContext.Provider>
    </Router>
  );
};
export default App;
