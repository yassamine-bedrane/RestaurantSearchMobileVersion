import { ScrollView, Text, ImageBackground } from 'react-native'
import React from 'react'
import image from '../assets/food.png'

const Screen2 = () => {
  return (
    <ScrollView style={{ flex: 1}}>
      <ImageBackground source={image} resizeMode="cover" style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginVertical: 15, marginHorizontal: 20 }}>
          Bienvenue sur notre application de recherche de restaurants !
        </Text>
        <Text style={{
          fontSize: 18, color: 'white', marginHorizontal: 20,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          padding: 20
        }}>
          Nous sommes dédiés à vous aider à trouver le restaurant parfait en fonction de votre emplacement et de vos préférences.
          Notre application utilise la dernière technologie pour vous fournir des informations précises et à jour sur les restaurants locaux. Nous travaillons avec les restaurants les mieux notés de votre région pour vous assurer d'avoir accès aux meilleures options de restauration.
          Notre équipe est composée de passionnés de cuisine qui aiment explorer de nouveaux restaurants et de nouvelles cuisines. Nous nous engageons à vous aider à trouver le restaurant parfait pour toute occasion, que ce soit un dîner romantique pour deux ou un repas familial convivial.
          Nous croyons que la restauration est plus que de manger. C'est une expérience qui rassemble les gens et crée des souvenirs. C'est pourquoi nous sommes dédiés à vous aider à découvrir de nouvelles et passionnantes options de restauration.
        </Text>
      </ImageBackground>
    </ScrollView>
  )
}

export default Screen2;