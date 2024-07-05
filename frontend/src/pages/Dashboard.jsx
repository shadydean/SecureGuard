import React, { useContext, useEffect, useState, Suspense, lazy } from "react";
import { AuthContext } from "../context/Auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Buffer } from "buffer";
import SideBar from "../components/SideBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { VaultContext } from "../context/Vaults";

const MediaContent = lazy(() => import("../components/MediaContent"));

const TopBar = ({ currVault,user,userDispatch }) => {
  const [isModelOpen,setIsModelOpen] = useState(false);

  function onLogout(){
    userDispatch({type:"LOGOUT",payload:{}});
  }

  return (
    <div className="flex justify-between mb-4">
      <input
        className="w-[40%] h-12 rounded-md outline-none"
        placeholder={`Search ${
          currVault[1] === "" ? "" : `in ${currVault[1]}`
        }`}
        type="search"
      />
        <button onClick={() => setIsModelOpen(mod => !mod)} className="rounded-full bg-white w-12 h-12 font-semibold text-3xl">
          A
        </button>
        {isModelOpen && (
          <div className='absolute right-8 top-20 mt-2 w-48 text-center bg-white rounded-md shadow-lg p-2'>
            <ul>
              <Link to={'/profile'}
                className='px-4 py-2 block hover:bg-gray-200 cursor-pointer'
                // onClick={() => handleOptionClick('Profile')}
              >
                Profile
              </Link>
              <button
                className='px-4 py-2 block mx-auto hover:bg-gray-200 cursor-pointer outline-none'
                // onClick={() => handleOptionClick('Feedback')}
              >
                Feedback
              </button>
              <button
                className='px-4 py-2 block mx-auto bg-red-600 rounded text-white hover:bg-red-500 cursor-pointer outline-none'
                onClick={onLogout}
              >
                Logout
              </button>
            </ul>
          </div>
        )}
      
    </div>
  );
};

const UploadBar = ({ currVault, handleUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onFileChange = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    // console.log(file)
    if (file) {
      handleUpload(file);
      setSelectedFile(null); // Clear the selected file after upload
    }
  };

  return (
    <div className="flex justify-between text-white mb-4">
      <h2 className="font-semibold text-2xl">
        <span className="text-slate-400">{currVault[0] + " > "}</span>{" "}
        {currVault[1]}
      </h2>
      <div className="flex">
        <button className="bg-white text-slate-800 ml-2 px-3 py-2 rounded-md font-semibold">
          Refresh
        </button>
        <input
          type="file"
          onChange={onFileChange}
          className="hidden"
          id="file-upload"
        />
        <button
          type="button"
          onClick={() => document.getElementById("file-upload").click()}
          className="bg-white text-slate-800 ml-2 px-3 py-2 rounded-md font-semibold"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user,dispatch : userDispatch } = useContext(AuthContext);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const { vaults, dispatch } = useContext(VaultContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [currVault, setCurrVault] = useState(["Media Vaults", ""]);
  const url = `http://localhost:4321/api/media/?vaultId=${id}`;

  function getCurrVault() {
    for (let vault of vaults.mediaVaults) {
      if (vault._id === id) setCurrVault(["Media Vaults", vault.name]);
    }

    for (let vault of vaults.bankVaults) {
      if (vault._id === id) setCurrVault(["Bank Vaults", vault.name]);
    }
  }

  const handleUpload = async (file) => {
    // console.log(file)
    // setLoading(true);
    const formData = new FormData();
    const data = {
      [file.type.split("/")[0]]: file,
      vaultId: id,
    };
    formData.append(file.type.split("/")[0], file); // Append file under image, video, or audio key
    formData.append("vaultId", id);

    // console.log(data,formData)

    const res = await fetch(`http://localhost:4321/api/media`, {
      method: "POST",
      headers: {
        "x-auth-token": user,
      },
      body: formData,
    });

    if (res.ok) {
      const newMedia = await res.json();
      // console.log(newMedia)
      setContent([...content, newMedia]);
      const cache = await caches.open("media-cache");
      
      cache.match(url).then((cachedResponse) => {
        if (cachedResponse) {
          cachedResponse.json().then((cachedData) => {
            cache.put(
              url,
              new Response(JSON.stringify([...cachedData, newMedia]))
            );
          });
        }
      });
    } else {
      console.log("Something went wrong");
    }
    // setLoading(false);
  };

  useEffect(() => {
    const fetchWithCache = async () => {
      const cacheName = "media-cache";
      const cache = await caches.open(cacheName);

      // Try to fetch from cache
      const cachedResponse = await cache.match(url);

      if (cachedResponse) {
        // Update the cache in the background
        fetch(url,{
          headers : {
            "x-auth-token": user,
          }
        }).then((response) => {
          if (response.ok) {
            cache.put(url, response);
          }
        });
        return cachedResponse; // Return the cached response immediately
      } else {
        // If not in cache, fetch from network
        const networkResponse = await fetch(url, {
          headers: {
            "x-auth-token": user,
          },
        });
        if (networkResponse.ok) {
          cache.put(url, networkResponse.clone());
        }
        return networkResponse;
      }
    };

    const fetchVault = async () => {
      setLoading(true);
      const res = await fetchWithCache();
      const data = await res.json();
      if (res.ok) {
        setContent(data);
      } else {
        console.log("Something went wrong");
      }
      setLoading(false);
    };

    if (!user) navigate("/");
    else fetchVault();
    getCurrVault();

    // const intervalId = setInterval(() => {
    //   fetchVault();
    // }, 150000); // 300000 ms = 5 minutes

    // return () => clearInterval(intervalId);
  }, [user, id]);

  return (
    <div className="flex h-screen">
      <SideBar />
      <section className="w-5/6 bg-slate-900 flex flex-col  text-black p-8 overflow-y-auto">
        <TopBar currVault={currVault} user={user} userDispatch={userDispatch} />
        <UploadBar currVault={currVault} handleUpload={handleUpload} />
        <div className="flex h-full flex-wrap items-start">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Suspense fallback={<LoadingSpinner />}>
              {content.length > 0 ? (
                content.map((media) => (
                  <MediaContent key={media._id} media={media} />
                ))
              ) : (
                <h1 className="text-white">No content</h1>
              )}
            </Suspense>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
