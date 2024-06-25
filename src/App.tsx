import { NavBar } from "antd-mobile";
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

export const MyContext = createContext<{ localStorage: LocalStorage | null }>({
  localStorage: null,
});

const App = () => {
  const [localStorage, setLocalStorage] = useState<LocalStorage | null>(null);
  const initData = async () => {
    const _localStorage = new LocalStorage();
    await _localStorage.init()
    setLocalStorage(_localStorage);
  };
  useEffect(() => {
    initData();
  }, []);

  return (
    <Router initialEntries={["/abstract-concrete-library"]}>
      <MyContext.Provider value={{ localStorage: localStorage }}>
        <div className={s.app}>
          {/* <div className={s.top}>
          <NavBar>配合路由使用</NavBar>
        </div> */}
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
      </MyContext.Provider>
    </Router>
  );
};
export default App;
