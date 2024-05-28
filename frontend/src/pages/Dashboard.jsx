import React, { useContext, useEffect, useState, Suspense, lazy } from 'react';
import { AuthContext } from '../context/Auth';
import { useNavigate, useParams } from 'react-router-dom';
import { Buffer } from 'buffer';
import SideBar from '../components/SideBar';
import LoadingSpinner from '../components/LoadingSpinner';

const MediaContent = lazy(() => import('../components/MediaContent'));

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [vaults, setVaults] = useState();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchVault = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:4321/api/media/?vaultId=${id}`, {
        method: 'GET',
        headers: {
          'x-auth-token': user,
        },
      });
      const data = await res.json();
      // console.log('Fetched Data:', data);
      if (res.ok) {
        setContent(data);
      } else {
        console.log('Something went wrong');
      }
      setLoading(false);
    };

    if (!user) navigate('/');
    else fetchVault();
  }, [user, id, navigate]);

   useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:4321/api/vault",{
        method : "GET",
        headers : {
          'x-auth-token' : user
          },
          credentials : "include"
      })

      if(res.ok){
        setVaults(await res.json())
      }
      else{
        console.log("something went wrong")
      }
    }

    if(user === null)
        nav("/")
    else
        fetchData()
  },[user])
 
  return (
    <div className="flex h-screen">
      <SideBar vaults={vaults} />
      <section className="w-5/6 bg-[#636365] text-black p-4 overflow-y-auto">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Suspense fallback={<LoadingSpinner />}>
            {content.length > 0 ? content.map((media) => (
              <MediaContent key={media._id} media={media} />
            )) : <h1>No content</h1>}
          </Suspense>
        )}
      </section>
    </div>
  );
};

export default Dashboard;