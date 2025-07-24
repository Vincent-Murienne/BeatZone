import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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
            const res = await fetch(`${API_URL}/register`, {
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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Inscription</Text>

            {step === 1 && (
                <>
                    <Text style={styles.subtitle}>Vous êtes :</Text>
                    <TouchableOpacity style={userType === 'artist' ? styles.activeBtn : styles.btn} onPress={() => setUserType('artist')}>
                        <Text style={styles.btnText}>Un groupe / artiste</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={userType === 'user' ? styles.activeBtn : styles.btn} onPress={() => setUserType('user')}>
                        <Text style={styles.btnText}>Un utilisateur</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={userType === 'owner' ? styles.activeBtn : styles.btn} onPress={() => setUserType('owner')}>
                        <Text style={styles.btnText}>Un organisateur</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.nextBtn} disabled={!userType} onPress={() => setStep(2)}>
                        <Text style={styles.nextBtnText}>Suivant</Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 2 && (
                <>
                    {userType === 'artist' && (
                        <>
                            <TextInput
                                placeholder="Nom du membre"
                                value={artistMemberName}
                                onChangeText={setArtistMemberName}
                                className="input"
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Email"
                                value={artistEmail}
                                onChangeText={setArtistEmail}
                                className="input"
                                keyboardType="email-address"
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Mot de passe"
                                value={artistPassword}
                                onChangeText={setArtistPassword}
                                secureTextEntry
                                className="input"
                                style={styles.input}
                            />
                        </>
                    )}

                    {userType === 'user' && (
                        <>
                            <TextInput
                                placeholder="Pseudo"
                                value={userPseudo}
                                onChangeText={setUserPseudo}
                                className="input"
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Email"
                                value={userEmail}
                                onChangeText={setUserEmail}
                                className="input"
                                keyboardType="email-address"
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Mot de passe"
                                value={userPassword}
                                onChangeText={setUserPassword}
                                secureTextEntry
                                className="input"
                                style={styles.input}
                            />
                        </>
                    )}

                    {userType === 'owner' && (
                        <>
                            <TextInput
                                placeholder="Prénom"
                                value={ownerFirstName}
                                onChangeText={setOwnerFirstName}
                                className="input"
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Nom"
                                value={ownerLastName}
                                onChangeText={setOwnerLastName}
                                className="input"
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Email"
                                value={ownerEmail}
                                onChangeText={setOwnerEmail}
                                className="input"
                                keyboardType="email-address"
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Mot de passe"
                                value={ownerPassword}
                                onChangeText={setOwnerPassword}
                                secureTextEntry
                                className="input"
                                style={styles.input}
                            />
                        </>
                    )}

                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => setStep(1)} className="p-3 items-start">
                            <Text style={styles.link}>Retour</Text>
                        </TouchableOpacity>

                        {userType === 'user' ? (
                            <TouchableOpacity onPress={handleSubmit} className="bg-purple-500 p-3 rounded-xl items-end">
                                <Text style={styles.link}>Créer un compte</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => setStep(3)} className="bg-purple-500 p-3 rounded-xl items-end">
                                <Text style={styles.link}>Suivant</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </>
            )}


            {step === 3 && (
                <>
                    {userType === 'artist' && (
                        <>
                            <TextInput placeholder="Nom du groupe" value={artistNameBand} onChangeText={setArtistNameBand} style={styles.input} />
                            <TextInput placeholder="Genre musical" value={artistMusic} onChangeText={setArtistMusic} style={styles.input} />
                            <TextInput placeholder="Ville" value={artistVille} onChangeText={setArtistVille} style={styles.input} />
                            <TextInput placeholder="Pays" value={artistPays} onChangeText={setArtistPays} style={styles.input} />
                        </>
                    )}
                    {userType === 'owner' && (
                        <>
                            <TextInput placeholder="Établissement" value={ownerBusinessName} onChangeText={setOwnerBusinessName} style={styles.input} />
                            <TextInput placeholder="Adresse" value={ownerAddress} onChangeText={setOwnerAddress} style={styles.input} />
                            <TextInput placeholder="Ville" value={ownerVille} onChangeText={setOwnerVille} style={styles.input} />
                            <TextInput placeholder="Code postal" value={ownerCp} onChangeText={setOwnerCp} style={styles.input} />
                        </>
                    )}

                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => setStep(2)}><Text style={styles.link}>Retour</Text></TouchableOpacity>
                        <TouchableOpacity onPress={handleSubmit}><Text style={styles.link}>Créer un compte</Text></TouchableOpacity>
                    </View>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#f2f2f2',
        flexGrow: 1
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center'
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderColor: '#ccc',
        borderWidth: 1
    },
    btn: {
        backgroundColor: '#ddd',
        padding: 12,
        borderRadius: 25,
        marginBottom: 10,
        alignItems: 'center'
    },
    activeBtn: {
        backgroundColor: '#a78bfa',
        padding: 12,
        borderRadius: 25,
        marginBottom: 10,
        alignItems: 'center'
    },
    btnText: {
        color: '#000'
    },
    nextBtn: {
        backgroundColor: '#6d28d9',
        padding: 12,
        borderRadius: 25,
        marginTop: 20,
        alignItems: 'center'
    },
    nextBtnText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    link: {
        color: '#6d28d9',
        fontWeight: 'bold',
        fontSize: 16
    }
});
export default Register;
