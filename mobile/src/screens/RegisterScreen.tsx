import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';

const Register = () => {
    const [userType, setUserType] = useState<'artist' | 'user' | 'owner' | null>(null);
    const [step, setStep] = useState(1);

    // Étape 2
    const [artistEmail, setArtistEmail] = useState('');
    const [artistPassword, setArtistPassword] = useState('');
    const [artistMemberName, setArtistMemberName] = useState('');

    const [userPseudo, setUserPseudo] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const [ownerEmail, setOwnerEmail] = useState('');
    const [ownerPassword, setOwnerPassword] = useState('');
    const [ownerLastName, setOwnerLastName] = useState('');
    const [ownerFirstName, setOwnerFirstName] = useState('');

    // Étape 3
    const [artistNameBand, setArtistNameBand] = useState('');
    const [artistMusic, setArtistMusic] = useState('');
    const [artistVille, setArtistVille] = useState('');
    const [artistPays, setArtistPays] = useState('');

    const [ownerBusinessName, setOwnerBusinessName] = useState('');
    const [ownerAddress, setOwnerAddress] = useState('');
    const [ownerVille, setOwnerVille] = useState('');
    const [ownerCp, setOwnerCp] = useState('');

    const handleSubmit = async () => {
        let payload;

        if (userType === 'artist') {
            payload = {
                type: 'artist',
                pseudo: artistMemberName,
                email: artistEmail,
                password: artistPassword,
                bandName: artistNameBand,
                music: artistMusic,
                city: artistVille,
                country: artistPays,
            };
        } else if (userType === 'user') {
            payload = {
                type: 'user',
                pseudo: userPseudo,
                email: userEmail,
                password: userPassword,
            };
        } else if (userType === 'owner') {
            payload = {
                type: 'owner',
                pseudo: ownerFirstName + ' ' + ownerLastName,
                email: ownerEmail,
                password: ownerPassword,
                businessName: ownerBusinessName,
                address: ownerAddress,
                city: ownerVille,
                postalCode: ownerCp,
            };
        } else {
            return;
        }

        console.log('Payload:', payload);

        try {
            const res = await fetch('http://10.151.17.254:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json();
                Alert.alert('Erreur', errorData.message);
            } else {
                Alert.alert('Succès', 'Inscription réussie !');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', 'Erreur réseau ou serveur');
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text className="text-center text-2xl font-bold mb-4">Inscription</Text>

            {step === 1 && (
                <>
                    <Text className="text-center mb-4">Vous êtes :</Text>
                    {['artist', 'user', 'owner'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setUserType(type as any)}
                            className={`p-4 rounded-lg mb-2 border ${userType === type ? 'bg-purple-200 border-purple-700' : 'bg-gray-200'
                                }`}
                        >
                            <Text className="text-center capitalize">{type === 'artist' ? 'Groupe / Artiste' : type === 'user' ? 'Utilisateur' : 'Organisateur'}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        onPress={() => userType && setStep(2)}
                        disabled={!userType}
                        className="bg-purple-500 p-4 rounded-xl mt-4"
                    >
                        <Text className="text-white text-center font-semibold">Suivant</Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 2 && (
                <>
                    {userType === 'artist' && (
                        <>
                            <TextInput placeholder="Nom du groupe" value={artistMemberName} onChangeText={setArtistMemberName} className="input" />
                            <TextInput placeholder="Email" value={artistEmail} onChangeText={setArtistEmail} className="input" keyboardType="email-address" />
                            <TextInput placeholder="Mot de passe" value={artistPassword} onChangeText={setArtistPassword} secureTextEntry className="input" />
                        </>
                    )}

                    {userType === 'user' && (
                        <>
                            <TextInput placeholder="Pseudo" value={userPseudo} onChangeText={setUserPseudo} className="input" />
                            <TextInput placeholder="Email" value={userEmail} onChangeText={setUserEmail} className="input" keyboardType="email-address" />
                            <TextInput placeholder="Mot de passe" value={userPassword} onChangeText={setUserPassword} secureTextEntry className="input" />
                        </>
                    )}

                    {userType === 'owner' && (
                        <>
                            <TextInput placeholder="Prénom" value={ownerFirstName} onChangeText={setOwnerFirstName} className="input" />
                            <TextInput placeholder="Nom" value={ownerLastName} onChangeText={setOwnerLastName} className="input" />
                            <TextInput placeholder="Email" value={ownerEmail} onChangeText={setOwnerEmail} className="input" keyboardType="email-address" />
                            <TextInput placeholder="Mot de passe" value={ownerPassword} onChangeText={setOwnerPassword} secureTextEntry className="input" />
                        </>
                    )}

                    <View className="flex-row justify-between mt-4">
                        <TouchableOpacity onPress={() => setStep(1)} className="p-3">
                            <Text>Retour</Text>
                        </TouchableOpacity>

                        {userType === 'user' ? (
                            <TouchableOpacity onPress={handleSubmit} className="bg-purple-500 p-3 rounded-xl">
                                <Text className="text-white">Créer un compte</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => setStep(3)} className="bg-purple-500 p-3 rounded-xl">
                                <Text className="text-white">Suivant</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </>
            )}

            {step === 3 && (
                <>
                    {userType === 'artist' && (
                        <>
                            <TextInput placeholder="Nom du groupe" value={artistNameBand} onChangeText={setArtistNameBand} className="input" />
                            <TextInput placeholder="Genre musical" value={artistMusic} onChangeText={setArtistMusic} className="input" />
                            <TextInput placeholder="Ville" value={artistVille} onChangeText={setArtistVille} className="input" />
                            <TextInput placeholder="Pays" value={artistPays} onChangeText={setArtistPays} className="input" />
                        </>
                    )}

                    {userType === 'owner' && (
                        <>
                            <TextInput placeholder="Nom de l'établissement" value={ownerBusinessName} onChangeText={setOwnerBusinessName} className="input" />
                            <TextInput placeholder="Adresse" value={ownerAddress} onChangeText={setOwnerAddress} className="input" />
                            <TextInput placeholder="Ville" value={ownerVille} onChangeText={setOwnerVille} className="input" />
                            <TextInput placeholder="Code postal" value={ownerCp} onChangeText={setOwnerCp} className="input" />
                        </>
                    )}

                    <View className="flex-row justify-between mt-4">
                        <TouchableOpacity onPress={() => setStep(2)} className="p-3">
                            <Text>Retour</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit} className="bg-purple-500 p-3 rounded-xl">
                            <Text className="text-white">Créer un compte</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </ScrollView>
    );
};

export default Register;
