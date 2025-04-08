$path = "C:\GitHub\roberquest\img\tokens"

$translations = @{
    # Bandidos
    "Bandit Archer" = "Bandido Arquero"
    "Bandit Brawler Unarmed" = "Bandido Luchador Desarmado"
    "Bandit Brute Club" = "Bandido Bruto Garrote"
    "Bandit Brute Shovel" = "Bandido Bruto Pala"
    "Bandit Bully Club" = "Bandido Matón Garrote"
    "Bandit Bully Mace" = "Bandido Matón Maza"
    "Bandit Captain Sword Dagger" = "Bandido Capitán Espada Daga"
    "Bandit Crossbow" = "Bandido Ballesta"
    "Bandit Dual Wield Axes" = "Bandido Doble Hacha"
    "Bandit Dual Wield Swords" = "Bandido Doble Espada"
    "Bandit Peasant Pitchfork" = "Bandido Campesino Horca"
    "Bandit Rogue Knife" = "Bandido Pícaro Cuchillo"
    "Bandit Rogue Torch" = "Bandido Pícaro Antorcha"
    "Bandit Sling" = "Bandido Honda"
    "Bandit Spear" = "Bandido Lanza"
    "Bandit Sword and Shield" = "Bandido Espada y Escudo"

    # Guardias del Desierto
    "Desert Cavalry Archer" = "Caballería Desierto Arquero"
    "Desert Cavalry Banner" = "Caballería Desierto Estandarte"
    "Desert Cavalry Spear" = "Caballería Desierto Lanza"
    "Desert Cavalry Sword" = "Caballería Desierto Cimitarra"
    "Desert Cavalry Sword Shield" = "Caballería Desierto Cimitarra Escudo"
    "Desert Guard Archer" = "Guardia Desierto Arquero"
    "Desert Guard Banner" = "Guardia Desierto Estandarte"
    "Desert Guard Club" = "Guardia Desierto Garrote"
    "Desert Guard Crossbow" = "Guardia Desierto Ballesta"
    "Desert Guard Spear" = "Guardia Desierto Lanza"
    "Desert Guard Sword Shield" = "Guardia Desierto Cimitarra Escudo"
    "At-Ease" = "Reposo"

    # Orcos (antes Goblins)
    "Goblin Archer Bow" = "Orco Arquero Arco"
    "Goblin Barbarian Axe" = "Orco Bárbaro Hacha"
    "Goblin Bomber" = "Orco Bombardero"
    "Goblin Druid" = "Orco Druida"
    "Goblin Druid Magic" = "Orco Druida Magia"
    "Goblin Fighter Dual Swords" = "Orco Guerrero Doble Espada"
    "Goblin Fighter Greatsword" = "Orco Guerrero Mandoble"
    "Goblin Fighter Spear" = "Orco Guerrero Lanza"
    "Goblin Fighter Sword" = "Orco Guerrero Espada"
    "Goblin Fighter Sword Shield" = "Orco Guerrero Espada Escudo"
    "Goblin Ranger Shortsword" = "Orco Explorador Espada Corta"
    "Goblin Rogue Dagger Crossbow" = "Orco Pícaro Daga Ballesta"
    "Goblin Spellcaster" = "Orco Hechicero"
    "Goblin Spellcaster Magic" = "Orco Hechicero Magia"

    # Guardias
    "Guard Archer" = "Guardia Arquero"
    "Guard Banner" = "Guardia Estandarte"
    "Guard Club" = "Guardia Garrote"
    "Guard Crossbow" = "Guardia Ballesta"
    "Guard Spear" = "Guardia Lanza"
    "Guard Sword Shield" = "Guardia Espada Escudo"
}

Get-ChildItem -Path $path -Filter "*.png" | ForEach-Object {
    $newName = $_.Name
    foreach ($key in $translations.Keys) {
        if ($newName -match $key) {
            $newName = $newName -replace $key, $translations[$key]
        }
    }
    if ($newName -ne $_.Name) {
        Rename-Item -Path $_.FullName -NewName $newName -Force
    }
}
